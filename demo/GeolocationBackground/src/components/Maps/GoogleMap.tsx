import React, {memo, useCallback, useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import MapView, {LatLng, MapPressEvent, Marker, Polyline, Region} from 'react-native-maps'
import {DEFAULT_LOCATION} from '../../constants'

interface IGoogleMapScreen {
  onPressMarker?: (position: LatLng) => void
  listAssets?: LatLng[]
  defaultLocation?: LatLng
  onPressAsset?: (data: LatLng) => void
}

export const GoogleMap = memo<IGoogleMapScreen>(
  ({onPressMarker, onPressAsset, defaultLocation, listAssets = []}) => {
    const [region, setRegion] = useState<Region>(
      {...DEFAULT_LOCATION, ...defaultLocation} ?? DEFAULT_LOCATION,
    )
    const [regionPress, setRegionPress] = useState<Region | undefined>()

    const handlePressMarker = useCallback(
      (coordinate: LatLng) => {
        onPressMarker?.(coordinate)
      },
      [onPressMarker],
    )

    const handlePressMarkerExist = useCallback(
      (asset: LatLng) => {
        onPressAsset?.(asset)
      },
      [onPressAsset],
    )
    useEffect(() => {
      if (defaultLocation) {
        setRegion({...DEFAULT_LOCATION, ...defaultLocation})
      }
    }, [defaultLocation])

    const handleMapPress = useCallback(
      ({nativeEvent: {coordinate}}: MapPressEvent) => {
        setRegionPress({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        })
        handlePressMarker(coordinate)
      },
      [handlePressMarker],
    )
    useEffect(() => {
      if (listAssets.length > 0) {
        setRegion(prevState => ({
          ...prevState,
          longitude: listAssets[listAssets.length - 1].longitude ?? 0,
          latitude: listAssets[listAssets.length - 1].latitude ?? 0,
        }))
      }
    }, [listAssets])

    return (
      <View style={styles.container}>
        <MapView
          zoomEnabled
          zoomControlEnabled
          style={styles.container}
          region={region}
          onPress={(event: MapPressEvent) => {
            handleMapPress(event)
          }}>
          <Marker
            coordinate={region}
            description={'Current Position'}
            title={'Current Position'}
            style={styles.icon}
          />
          <Polyline coordinates={listAssets} strokeColor={'#000'} strokeWidth={6} />

          {listAssets[listAssets.length - 1] && (
            <Marker
              coordinate={listAssets[listAssets.length - 1]}
              description={'New Position'}
              title={'New Position'}
              style={styles.icon}
            />
          )}
          {!!regionPress && <Marker coordinate={regionPress} style={styles.icon} />}
        </MapView>
      </View>
    )
  },
)

GoogleMap.displayName = 'GoogleMap'
const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    width: 20,
    height: 20,
  },
})
