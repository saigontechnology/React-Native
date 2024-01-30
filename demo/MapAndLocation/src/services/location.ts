import {PermissionsAndroid} from 'react-native'
import Geolocation, {GeolocationResponse} from '@react-native-community/geolocation'
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
  requestMultiple,
  checkMultiple,
  check,
} from 'react-native-permissions'
import {isIOS} from '../themes'
import {DEFAULT_GET_LOCATION_INTERVAL} from '../constants'

export type SearchAddressGoogleMap = {
  address_components?: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types?: string[]
  place_id?: string
  plus_code?: {
    compound_code: string
    global_code: string
  }
  formatted_address: string
}

export const requestUserLocation = async () => {
  try {
    let result
    if (isIOS) {
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      if (result === 'granted') {
        requestLocationAccuracy({purposeKey: 'full'}) // 'full' | 'reduced'
          .then(accuracy => console.log(`Location accuracy is: ${accuracy}`))
          .catch(() => console.warn('Cannot request location accuracy'))
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
        })
        return true
      }
    } else {
      result = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ])
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
        result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
      ) {
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
        })
        return true
      }
    }
    return false
  } catch (e) {
    console.log('Cannot request Location permission', e)
    return false
  }
}

export const requestUserLocationBackground = async () => {
  try {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ])
    if (result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'granted') {
      Geolocation.setRNConfiguration({
        authorizationLevel: 'always',
        enableBackgroundLocationUpdates: true,
        skipPermissionRequests: false,
      })
      return true
    } else {
      return false
    }
  } catch (e) {
    console.log('Cannot request Location permission', e)
    return false
  }
}

export const checkUserLocation = async () => {
  try {
    let result
    if (isIOS) {
      result = await checkMultiple([PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS])
      return (
        result['ios.permission.LOCATION_WHEN_IN_USE'] === 'granted' ||
        result['ios.permission.LOCATION_ALWAYS'] === 'granted'
      )
    } else {
      result = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ])
      await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      return (
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
        result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
      )
    }
  } catch (e) {
    console.log('Cannot check Location permission', e)
    return false
  }
}

export const checkUserBackgroundLocation = async () => {
  try {
    let result
    if (isIOS) {
      result = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      return result === 'granted'
    } else {
      result = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
      return result === 'granted'
    }
  } catch (e) {
    console.log('Cannot get Background Location permission', e)
    return false
  }
}

export const watchLocation = (callback: (res: GeolocationResponse) => void) => {
  const watchId = Geolocation.watchPosition(
    callback,
    error => console.log('Error watch current Location:', error.message),
    {
      enableHighAccuracy: false,
      interval: DEFAULT_GET_LOCATION_INTERVAL,
    },
  )
  return watchId
}

export const getLocation = (callback: (res: GeolocationResponse) => void) => {
  Geolocation.getCurrentPosition(
    callback,
    error => console.log('Error get current Location:', error.message),
    {
      enableHighAccuracy: false,
      timeout: 120000,
    },
  )
}
