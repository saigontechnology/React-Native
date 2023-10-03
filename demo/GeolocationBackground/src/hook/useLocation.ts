import {useState, useEffect, useCallback} from 'react'
import * as Location from 'expo-location'
import {LOCATION_TASK_NAME} from '../services'

export const useLocation = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false)
  const [hasBackgroundLocationPermission, setHasBackgroundLocationPermission] = useState<boolean>(false)
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
      const response = await Location.getBackgroundPermissionsAsync()
      console.log('getBackgroundPermissionsAsync', response)
      if (response.status === 'granted') {
        setHasBackgroundLocationPermission(true)
        return true
      }
      const {status} = await Location.requestBackgroundPermissionsAsync()
      console.log('requestLocationBackground status', status)
      if (status === 'granted') {
        setHasBackgroundLocationPermission(true)
        return true
      }
    } catch (error) {
      console.log('requestLocationBackground ERROR', error)
    }
    setHasBackgroundLocationPermission(false)
    return false
  }, [])

  const hasTaskBackground = useCallback(async (taskName = LOCATION_TASK_NAME) => {
    const isHas = await Location.hasStartedLocationUpdatesAsync(taskName)
    console.log('hasTaskBackground', isHas)
    return isHas
  }, [])

  return {
    hasLocationPermission,
    requestLocationBackground,
    positionLocation,
    hasBackgroundLocationPermission,
    setPositionLocation,
    getCurrentLocation,
    hasTaskBackground,
  }
}
