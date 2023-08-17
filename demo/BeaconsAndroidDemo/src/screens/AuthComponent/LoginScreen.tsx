import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {useEffect, useState} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Button, DeviceEventEmitter, PermissionsAndroid, Text} from 'react-native'
import Beacons from 'react-native-beacons-manager'
import {isIOS} from '../../themes'

const region = {
  identifier: 'baobao',
  uuid: '27EB1481-6D19-4D70-8984-F1B9B7D49310',
} as const

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.LoginScreen>
export const LoginScreen: React.FC<Props> = props => {
  const [foundBeacon, setFoundBeacon] = useState({})
  const requestPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ])
    if (Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED)) {
      console.log('permission enabled')
    } else {
      console.log('permission denied')
    }
  }

  const nearestBeacon = beacons => {
    let i
    let minDistIndex = 0
    let minDist = Number.MAX_VALUE
    for (i = 0; i < beacons.length; i++) {
      if (beacons[i].distance < minDist) {
        minDist = beacons[i].distance
        minDistIndex = i
      }
    }
    return beacons[minDistIndex]
  }

  useEffect(() => {
    if (!isIOS) {
      requestPermission().then()
      Beacons.detectIBeacons()
      Beacons.detectAltBeacons()
    }
  }, [])

  const onStartMonitor = async () => {
    try {
      await Beacons.startRangingBeaconsInRegion(region.identifier, region.uuid)
      console.log('Beacons ranging started succesfully!')
    } catch (err) {
      console.log(`Beacons ranging not started, error: ${err}`)
    }
    // Print a log of the detected iBeacons (1 per second)
    DeviceEventEmitter.addListener('beaconsDidRange', data => {
      if (data.beacons.length > 0) {
        const beacon = nearestBeacon(data.beacons)
        setFoundBeacon(beacon)
      }
    })
  }

  const onStopMonitor = async () => {
    // Beacons.stopMonitoringForRegion(region).then()
    await Beacons.stopRangingBeaconsInRegion(region.identifier, region.uuid)
    DeviceEventEmitter.removeAllListeners('beaconsDidRange')
    console.log('Beacons ranging stopped succesfully!')
  }
  return (
    <ScreenContainer>
      <Button title={'Start Monitor'} onPress={onStartMonitor} />
      <Button title={'Stop Monitor'} onPress={onStopMonitor} />
      <ScreenContainer style={{paddingHorizontal: 16}}>
        <Text>Found Beacon</Text>
        {Object.keys(foundBeacon).map(k => (
          <Text>{foundBeacon[k]}</Text>
        ))}
      </ScreenContainer>
    </ScreenContainer>
  )
}
