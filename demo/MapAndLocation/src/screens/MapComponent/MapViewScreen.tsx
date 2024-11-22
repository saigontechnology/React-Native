import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {StyleSheet} from 'react-native'
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps'
import {PrimaryButton, ScreenContainer, UserMarker} from '../../components'
import {RouteKey} from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {deviceWidth, metrics} from '../../themes'
import {
  DEFAULT_GET_LOCATION_INTERVAL,
  DEFAULT_LATITUDE_DELTA,
  DEFAULT_LONGITUDE_DELTA,
  DEFAULT_REGION,
} from '../../constants'
import {useAppDispatch, useSelector} from '../../store/store'

import {getLocationData} from '../../store/selectors'
import {getLocation} from '../../services/location'
import {appActions} from '../../store/reducers'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.MapViewScreen> & PropsWithChildren

const DEMO_LOCATION = [
  {
    latitude: 10.8088094,
    longitude: 106.6724508,
  },
  {
    latitude: 10.808714,
    longitude: 106.673078,
  },
  {
    latitude: 10.808985,
    longitude: 106.673629,
  },
  {
    latitude: 10.8087982,
    longitude: 106.6724154,
  },
  {
    latitude: 10.8087982,
    longitude: 106.6724154,
  },
  {
    latitude: 10.8087982,
    longitude: 106.6724154,
  },
]
let getLocationTime = 0
let timeout: NodeJS.Timeout

export const MapViewScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch()
  const location = useSelector(getLocationData)
  const mapRef = useRef<MapView>(null)

  const [useFake, setUseFake] = useState(false)

  const getLocationReal = useCallback(() => {
    timeout = setTimeout(() => {
      getLocation(locationData => {
        dispatch(appActions.setLocation(locationData.coords))
        getLocationReal()
      })
    }, DEFAULT_GET_LOCATION_INTERVAL)
  }, [dispatch])

  const getLocationFake = useCallback(() => {
    timeout = setTimeout(() => {
      dispatch(appActions.setLocation(DEMO_LOCATION[getLocationTime++ % 6]))
      getLocationFake()
    }, DEFAULT_GET_LOCATION_INTERVAL)
  }, [dispatch])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Simple Map with Location',
    })
  }, [navigation])

  useEffect(() => {
    if (useFake) {
      getLocationFake()
    } else {
      getLocationReal()
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [getLocationFake, getLocationReal, useFake])

  const currentLocation = useMemo(
    () => ({
      longitude: location?.longitude || DEFAULT_REGION.longitude,
      latitude: location?.latitude || DEFAULT_REGION.latitude,
    }),
    [location?.latitude, location?.longitude],
  )

  const initialRegion = useMemo(
    () => ({
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      ...currentLocation,
    }),
    [currentLocation],
  )

  return (
    <ScreenContainer>
      <MapView ref={mapRef} provider={PROVIDER_DEFAULT} style={styles.map} initialRegion={initialRegion}>
        <UserMarker location={currentLocation} />
      </MapView>
      <PrimaryButton
        text={useFake ? 'Stop Simulate' : 'Simulate FAKE locations'}
        onPress={() => setUseFake(prev => !prev)}
        style={styles.button}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    left: metrics.large,
    bottom: metrics.large,
    width: deviceWidth() - metrics.large * 2,
  },
})
