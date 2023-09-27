import {useState, useEffect, useCallback} from 'react'
import * as Location from 'expo-location'

export const useLocation = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false)
  const [positionLocation, setPositionLocation] = useState<Location.LocationObject | undefined>()

  const getCurrentLocation = useCallback(async () => {
    try {
      const result = await Location.getCurrentPositionAsync({})
      setPositionLocation(result)
    } catch (error) {
      console.log('getCurrentLocation ERROR', error)
    }
  }, [])
  useEffect(() => {
    ;(async () => {
      const {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      } else {
        setHasLocationPermission(true)
        await getCurrentLocation()
      }
    })()
  }, [])

  const requestLocationBackground = useCallback(async () => {
    try {
      const {status} = await Location.requestBackgroundPermissionsAsync()
      console.log('requestLocationBackground status', status)
      if (status === 'granted') {
        return true
      }
    } catch (error) {
      console.log('requestLocationBackground ERROR', error)
    }
    return false
  }, [])

  return {
    hasLocationPermission,
    requestLocationBackground,
    positionLocation,
    setPositionLocation,
    getCurrentLocation,
  }
}
