import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import {DatabaseRef} from './index'

export const LOCATION_TASK_NAME = 'background-location-task'
export const pushToFirebase = (location: any) =>
  DatabaseRef.set(location).then(() => console.log('Data updated.'))

export const startLocationUpdate = async () => {
  const {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync()
  if (foregroundStatus === 'granted') {
    const {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync()
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Background Location',
          notificationBody: 'This is a background location notification',
        },
        timeInterval: 1000,
        distanceInterval: 0,
      })
    }
  }
}
export const stopLocationUpdate = async () => {
  const isHas = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
  console.log(isHas)
  if (isHas) {
    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME)
  }
}
