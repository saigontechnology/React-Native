import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {View, StyleSheet} from 'react-native'
import MapView, {Marker, PROVIDER_DEFAULT, Polyline} from 'react-native-maps'
import {ScreenContainer} from '../../components'
import {RouteKey} from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {colors, deviceWidth, metrics} from '../../themes'
import {DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA, DEFAULT_REGION} from '../../constants'
import {useSelector} from '../../store/store'

import {getLocationData} from '../../store/selectors'
import {DEMO_PLACE, DEMO_ROUTE} from './constant'
import DropDownPicker from 'react-native-dropdown-picker'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.MapRouteScreen> & PropsWithChildren

type RouteType = 'A' | 'B' | 'C' | ''
type RouteKeyType = 'A-B' | 'A-C' | 'B-C'

export const MapRouteScreen: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState(DEMO_PLACE)
  const [openLeft, setOpenLeft] = useState(false)
  const [valueLeft, setValueLeft] = useState<RouteType>('')
  const [openRight, setOpenRight] = useState(false)
  const [valueRight, setValueRight] = useState<RouteType>('')
  const location = useSelector(getLocationData)
  const mapRef = useRef<MapView>(null)

  const routeData = useMemo(() => {
    if (!valueLeft || !valueRight || valueLeft === valueRight) {
      return []
    }
    const sortValues = [valueLeft, valueRight].sort()
    const routeKey: RouteKeyType = `${sortValues[0]}-${sortValues[1]}` as RouteKeyType
    return DEMO_ROUTE[routeKey]
  }, [valueLeft, valueRight])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Map Route',
    })
  }, [navigation])

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
        {!!routeData.length && (
          <>
            <Marker coordinate={routeData[0]} />
            <Marker coordinate={routeData[routeData.length - 1]} />
            <Polyline
              coordinates={routeData}
              strokeWidth={metrics.xxxs}
              strokeColor={colors.primary}
              lineCap="round"
            />
          </>
        )}
      </MapView>
      <View style={styles.row}>
        <DropDownPicker
          open={openLeft}
          value={valueLeft}
          items={items}
          setOpen={setOpenLeft}
          setValue={setValueLeft}
          setItems={setItems}
          style={styles.selectStyle}
          containerStyle={styles.selectContainer}
          dropDownContainerStyle={styles.selectDropdown}
        />
        <DropDownPicker
          open={openRight}
          value={valueRight}
          items={items}
          setOpen={setOpenRight}
          setValue={setValueRight}
          setItems={setItems}
          style={styles.selectStyle}
          containerStyle={[styles.selectContainer, {marginLeft: metrics.small}]}
          dropDownContainerStyle={styles.selectDropdown}
        />
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    position: 'absolute',
    left: metrics.large,
    top: metrics.zero,
    width: deviceWidth() - metrics.large * 2,
  },
  selectContainer: {
    flex: 1,
    marginTop: metrics.small,
  },
  selectStyle: {
    borderColor: colors.gray,
    minHeight: metrics.dropdownHeight,
  },
  selectDropdown: {
    borderColor: colors.gray,
  },
})
