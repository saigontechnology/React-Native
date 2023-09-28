/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react'
import {AppState, Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'

import {
  GoogleMap,
  LOCATION_TASK_NAME,
  pushToFirebase,
  startLocationUpdate,
  stopLocationUpdate,
  useLocation,
} from './src'
import * as TaskManager from 'expo-task-manager'
import database from '@react-native-firebase/database'
import {LatLng} from 'react-native-maps'

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  console.log(LOCATION_TASK_NAME, data, error)
  if (error) {
    // Error occurred - check `error.message` for more details.
    return
  }
  if (data) {
    const {locations} = data as any
    if (locations && locations[0] && locations[0].timestamp) {
      const now = new Date(locations[0].timestamp).toISOString()
      database()
        .ref(`/tracking/${now.replace('.', '_')}`)
        .set(locations[0])
        .then(() => console.log('Data updated.'))
    }
  }
})
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  const {
    hasLocationPermission,
    hasBackgroundLocationPermission,
    positionLocation,
    getCurrentLocation,
    requestLocationBackground,
    hasTaskBackground,
  } = useLocation()

  const handleGetCurrentLocations = useCallback(async () => {
    if (hasLocationPermission) {
      await getCurrentLocation()
    }
  }, [getCurrentLocation, hasLocationPermission])
  const [isHasTaskBackground, setIsHasTaskBackground] = useState<boolean>(false)
  const [list, setList] = useState<LatLng[]>([])
  const handleRequestLocationBackground = useCallback(async () => {
    if (hasLocationPermission) {
      await requestLocationBackground()
    }
  }, [hasLocationPermission, requestLocationBackground])

  const handleHasTaskBackground = useCallback(async () => {
    const isHas = await hasTaskBackground()
    setIsHasTaskBackground(isHas)
  }, [hasTaskBackground])

  const appStateRef = useRef(AppState.currentState)

  const handleAppState = useCallback(() => {
    AppState.addEventListener('change', nextAppState => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        database()
          .ref('/tracking')
          .once('value')
          .then(e => {
            setList(
              Object.values(e.val()).map((l: any) => ({
                latitude: l?.coords?.latitude ?? 0,
                longitude: l?.coords?.longitude ?? 0,
              })),
            )
          })
        handleHasTaskBackground().then()
      }
      appStateRef.current = nextAppState
    })
  }, [])

  useEffect(() => {
    handleAppState()
  }, [handleAppState])

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
          listAssets={list}
        />
        <View style={styles.button}>
          <View style={styles.containerButton}>
            <Button
              color={'red'}
              disabled={!isHasTaskBackground}
              onPress={() => {
                stopLocationUpdate().then(() => setIsHasTaskBackground(false))
              }}
              title={'Stop Tracking'}
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              color={'green'}
              disabled={isHasTaskBackground}
              onPress={() => {
                startLocationUpdate().then(() => setIsHasTaskBackground(true))
              }}
              title={'Start Tracking'}
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              disabled={hasBackgroundLocationPermission}
              onPress={handleRequestLocationBackground}
              title={'request Location Background'}
            />
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
