/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {map, filter} from 'rxjs/operators';

import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {GoogleMap} from './src';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [sensorText, setSensorText] = useState<string>('');
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<
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

  useEffect(() => {
    requestPermission().then();
  }, [requestPermission]);

  // setUpdateIntervalForType(SensorTypes.accelerometer, 50); // defaults to 100ms
  //
  // useEffect(() => {
  //   accelerometer
  //     .pipe(
  //       map(({x, y, z}) => x + y + z),
  //       filter(speed => speed > 15),
  //     )
  //     .subscribe(
  //       speed => {
  //         console.log(`You moved your phone with ${speed}`);
  //         setSensorText(`You moved your phone with ${speed}`);
  //       },
  //       error => {
  //         console.log('The sensor is not available', error);
  //       },
  //     );
  // }, []);

  const handleGetCurrentLocation = useCallback(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setCurrentLocation(position);
        },
        error => {
          setCurrentLocation(undefined);
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [hasLocationPermission]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flexGrow: 1}}>
        <GoogleMap
          defaultLocation={
            currentLocation?.coords
              ? {
                  latitude: currentLocation?.coords?.latitude,
                  longitude: currentLocation?.coords?.longitude,
                }
              : undefined
          }
        />
        <View style={styles.button}>
          <Button
            onPress={handleGetCurrentLocation}
            title={'check current location'}
          />
        </View>
        <Text style={styles.text}>
          <Text>{`latitude: ${currentLocation?.coords?.latitude}\n`}</Text>
          <Text>{`longitude: ${currentLocation?.coords?.longitude}\n`}</Text>
          <Text>{`accuracy: ${currentLocation?.coords?.accuracy}\n`}</Text>
          <Text>{`speed: ${currentLocation?.coords?.speed}\n`}</Text>
          <Text>{`heading: ${currentLocation?.coords?.heading}\n`}</Text>
          <Text>{`altitude: ${currentLocation?.coords?.altitude}\n`}</Text>
          <Text>{`altitudeAccuracy: ${currentLocation?.coords?.altitudeAccuracy}`}</Text>
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
