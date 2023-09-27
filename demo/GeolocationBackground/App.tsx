/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect} from 'react'
import {Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'

import {
  DatabaseRef,
  GoogleMap,
  LOCATION_TASK_NAME,
  pushToFirebase,
  startLocationUpdate,
  stopLocationUpdate,
  useLocation,
} from './src'
import * as TaskManager from 'expo-task-manager'

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  console.log(LOCATION_TASK_NAME, data, error)
  if (error) {
    // Error occurred - check `error.message` for more details.
    return
  }
  if (data) {
    DatabaseRef.set(data).then(() => console.log('TaskManager.defineTask: Data updated.'))
  }
})
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  const {hasLocationPermission, positionLocation, getCurrentLocation, requestLocationBackground} =
    useLocation()

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
            positionLocation?.coords
              ? {
                  latitude: positionLocation?.coords?.latitude,
                  longitude: positionLocation?.coords?.longitude,
                }
              : undefined
          }
        />
        <View style={styles.button}>
          <View style={styles.containerButton}>
            <Button onPress={() => stopLocationUpdate().then()} title={'Stop Tracking'} />
          </View>
          <View style={styles.containerButton}>
            <Button onPress={() => startLocationUpdate().then()} title={'Start Tracking'} />
          </View>
          <View style={styles.containerButton}>
            <Button onPress={handleRequestLocationBackground} title={'request Location Background'} />
          </View>
          <View style={styles.containerButton}>
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
  containerButton: {
    paddingTop: 16,
  },
  button: {
    position: 'absolute',
    bottom: 24,
    padding: 16,
  },
})

export default App
