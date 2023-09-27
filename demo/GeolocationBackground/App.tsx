/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react'
import {Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'

import {DatabaseRef, GoogleMap, useLocation} from './src'
import {LocationObject as GeoPosition} from 'expo-location'

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  const [currentLocations, setCurrentLocations] = useState<GeoPosition[]>([])

  const {hasLocationPermission, positionLocation, getCurrentLocation, requestLocationBackground} =
    useLocation()

  const pushToFirebase = useCallback(
    (location: any) => DatabaseRef.set(location).then(() => console.log('Data updated.')),
    [],
  )

  const handleGetCurrentLocations = useCallback(async () => {
    if (hasLocationPermission) {
      await getCurrentLocation()
    }
  }, [getCurrentLocation, hasLocationPermission])

  const handleRequestLocationBackground = useCallback(async () => {
    if (hasLocationPermission) {
      await requestLocationBackground()
    }
  }, [hasLocationPermission, requestLocationBackground])

  useEffect(() => {
    console.log(positionLocation)
    if (positionLocation) {
      pushToFirebase(positionLocation).then()
    }
  }, [positionLocation, pushToFirebase])

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
          <View style={{paddingTop: 16}}>
            <Button onPress={handleRequestLocationBackground} title={'request Location Background'} />
          </View>
          <View style={{paddingTop: 16}}>
            <Button onPress={handleGetCurrentLocations} title={'add Current Position'} />
          </View>
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
  )
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
})

export default App
