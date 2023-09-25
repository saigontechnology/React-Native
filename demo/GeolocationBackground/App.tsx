/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {DatabaseRef, GoogleMap} from './src';
import {LatLng} from 'react-native-maps';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [currentLocations, setCurrentLocations] = useState<GeoPosition[]>([]);
  const [positionLocation, setPositionLocation] = useState<
    GeoPosition | undefined
  >();

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const resultAndroid = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        if (
          resultAndroid['android.permission.ACCESS_COARSE_LOCATION'] ===
            'granted' &&
          resultAndroid['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          setHasLocationPermission(true);
        }
      } catch (error) {
        console.log('requestPermission error', error);
        setHasLocationPermission(false);
      }
      return;
    }
    try {
      const resultIOS = await Geolocation.requestAuthorization('always');
      if (resultIOS === 'granted') {
        setHasLocationPermission(true);
      }
    } catch (error) {
      console.log('requestPermission error', error);
    }
  }, [setHasLocationPermission]);

  const pushToFirebase = useCallback(
    (location: LatLng) =>
      DatabaseRef.set(location).then(() => console.log('Data updated.')),
    [],
  );

  const handleGetCurrentLocations = useCallback(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);

          setCurrentLocations(prevState => [...prevState, position]);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [hasLocationPermission]);

  useEffect(() => {
    requestPermission().then(handleGetCurrentLocations);
  }, [handleGetCurrentLocations, requestPermission]);

  useEffect(() => {
    // Start watching the user's position
    const watchId = Geolocation.watchPosition(
      position => {
        console.log(position);
        setPositionLocation(position);
      },
      error => {
        console.log(error.code, error.message);
        setPositionLocation(undefined);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
        interval: 2000,
        fastestInterval: 1000,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (positionLocation) {
      pushToFirebase({
        longitude: positionLocation.coords.longitude,
        latitude: positionLocation.coords.latitude,
      }).then();
    }
  }, [positionLocation, pushToFirebase]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flexGrow: 1}}>
        <GoogleMap
          defaultLocation={
            currentLocations[0]?.coords
              ? {
                  latitude: currentLocations[0]?.coords?.latitude,
                  longitude: currentLocations[0]?.coords?.longitude,
                }
              : undefined
          }
          listAssets={currentLocations.map(e => ({
            latitude: e?.coords?.latitude ?? 0,
            longitude: e?.coords?.longitude ?? 0,
          }))}
        />
        <View style={styles.button}>
          <Button
            onPress={handleGetCurrentLocations}
            title={'add Current Position'}
          />
        </View>
        <Text style={styles.text}>
          <Text>{`latitude: ${positionLocation?.coords?.latitude}\n`}</Text>
          <Text>{`longitude: ${positionLocation?.coords?.longitude}\n`}</Text>
          <Text>{`accuracy: ${positionLocation?.coords?.accuracy}\n`}</Text>
          <Text>{`speed: ${positionLocation?.coords?.speed}\n`}</Text>
          <Text>{`heading: ${positionLocation?.coords?.heading}\n`}</Text>
          <Text>{`altitude: ${positionLocation?.coords?.altitude}\n`}</Text>
          <Text>{`altitudeAccuracy: ${positionLocation?.coords?.altitudeAccuracy}`}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    right: 10,
    color: 'white',
    position: 'absolute',
    backgroundColor: Colors.darker,
  },
  button: {
    position: 'absolute',
    bottom: 24,
    padding: 16,
  },
});

export default App;
