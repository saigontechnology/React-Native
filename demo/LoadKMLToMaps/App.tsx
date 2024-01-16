/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import {kml} from '@tmcw/togeojson';
import {DOMParser} from '@xmldom/xmldom';
import {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MapView, {Geojson, MAP_TYPES, PROVIDER_DEFAULT} from 'react-native-maps';

const fetchKML = async () => {
  const url =
    'https://gist.githubusercontent.com/ydhnwb/64e6fe9671ffad43d4a75004ef20a426/raw/93077a2dacd19eab53083ad7f77a6cae700a5992/example_kml_multi_midpoint_and_multi_polygon.kml';
  const result = await axios
    .get(url)
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log(e);
      return null;
    });

  if (result != null) {
    const theKML = new DOMParser().parseFromString(result);
    const converted = kml(theKML);
    return converted;
  }
  return null;
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const mapRef = useRef<MapView>(null);
  const [myPlaces, setMyPlaces] =
    useState<FeatureCollection<Geometry, GeoJsonProperties>>();

  useEffect(() => {
    fetchKML().then(places => {
      setMyPlaces(places as FeatureCollection<Geometry, GeoJsonProperties>);
      if (mapRef.current) {
        if (places?.features[0].geometry) {
          const [latitude, longitude] = [-6.2092, 106.8394];
          const initialRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          mapRef.current?.animateToRegion(initialRegion, 1000);
        }
      }
    });
  }, []);

  // const myPlace: FeatureCollection<Geometry, GeoJsonProperties> = {
  //   type: 'FeatureCollection',
  //   features: [
  //     {
  //       type: 'Feature',
  //       properties: {},
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-6.2092, 106.8394],
  //       },
  //     },
  //   ],
  // };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {myPlaces && (
        <MapView
          ref={mapRef}
          style={styles.maps}
          provider={PROVIDER_DEFAULT}
          mapType={MAP_TYPES.STANDARD}
          zoomEnabled={true}
          region={{
            latitude: -6.2092,
            longitude: 106.8394,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Geojson
            geojson={myPlaces}
            strokeColor="red"
            fillColor="green"
            strokeWidth={2}
          />
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maps: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
