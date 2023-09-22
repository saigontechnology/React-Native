import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Region,
} from 'react-native-maps';
import {DEFAULT_LOCATION} from '../../constants';

interface IGoogleMapScreen {
  onPressMarker?: (position: LatLng) => void;
  listAssets?: LatLng[];
  defaultLocation?: LatLng;
  onPressAsset?: (data: LatLng) => void;
}

export const GoogleMap = memo<IGoogleMapScreen>(
  ({onPressMarker, onPressAsset, defaultLocation, listAssets = []}) => {
    const [region, setRegion] = useState<Region>(
      {...DEFAULT_LOCATION, ...defaultLocation} ?? DEFAULT_LOCATION,
    );
    const [regionPress, setRegionPress] = useState<Region | undefined>();

    const handlePressMarker = useCallback(
      (coordinate: LatLng) => {
        onPressMarker?.(coordinate);
      },
      [onPressMarker],
    );

    const handlePressMarkerExist = useCallback(
      (asset: LatLng) => {
        onPressAsset?.(asset);
      },
      [onPressAsset],
    );
    useEffect(() => {
      if (defaultLocation) {
        setRegion({...DEFAULT_LOCATION, ...defaultLocation});
      }
    }, [defaultLocation]);

    const handleMapPress = useCallback(
      ({nativeEvent: {coordinate}}: MapPressEvent) => {
        setRegionPress({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
        handlePressMarker(coordinate);
      },
      [handlePressMarker],
    );
    useEffect(() => {
      if (listAssets.length > 0) {
        setRegion(prevState => ({
          ...prevState,
          longitude: listAssets[listAssets.length - 1].longitude ?? 0,
          latitude: listAssets[listAssets.length - 1].latitude ?? 0,
        }));
      }
    }, [listAssets]);

    return (
      <View style={styles.container}>
        <MapView
          zoomEnabled
          zoomControlEnabled
          style={styles.container}
          region={region}
          onPress={(event: MapPressEvent) => {
            handleMapPress(event);
          }}>
          {listAssets.length > 0 &&
            listAssets?.map((item, index) => (
              <Marker
                key={index}
                coordinate={item}
                onPress={() => handlePressMarkerExist(item)}
              />
            ))}
          {!!regionPress && (
            <Marker coordinate={regionPress} style={styles.icon} />
          )}
        </MapView>
      </View>
    );
  },
);

GoogleMap.displayName = 'GoogleMap';
const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    width: 20,
    height: 20,
  },
});
