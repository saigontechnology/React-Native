/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo, useRef, useState} from 'react'

import {SafeAreaView, StatusBar, StyleSheet, useColorScheme} from 'react-native'
import axios from 'axios'
import {kml} from '@tmcw/togeojson'
import {DOMParser} from '@xmldom/xmldom'
import {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson'

import {Colors} from 'react-native/Libraries/NewAppScreen'
import MapView, {Geojson, MAP_TYPES, PROVIDER_DEFAULT} from 'react-native-maps'
import {DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA} from '../../constants'

const fetchKML = async () => {
  const url =
    // 'https://gist.githubusercontent.com/ydhnwb/64e6fe9671ffad43d4a75004ef20a426/raw/93077a2dacd19eab53083ad7f77a6cae700a5992/example_kml_multi_midpoint_and_multi_polygon.kml';
    'https://gist.githubusercontent.com/loc-nguyenthien/b1abfa99a03f5a905c08b7f0cc76027f/raw/aaf872c4f437eb5bac724549d0484bc9ba0e34db/kmlFile.kml'
  const result = await axios
    .get(url)
    .then(res => res.data)
    .catch(e => {
      console.log(e)
      return null
    })

  if (result != null) {
    const theKML = new DOMParser().parseFromString(result)
    const converted = kml(theKML)
    return converted
  }
  return null
}

export const LoadKmlScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  const mapRef = useRef<MapView>(null)
  const [myPlaces, setMyPlaces] = useState<FeatureCollection<Geometry, GeoJsonProperties>>()

  useEffect(() => {
    fetchKML().then(places => {
      setMyPlaces(places as FeatureCollection<Geometry, GeoJsonProperties>)
    })
  }, [])

  const initialRegion = useMemo(
    () => ({
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      latitude: 10.7729827,
      longitude: 106.7152277,
    }),
    [],
  )

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
          initialRegion={initialRegion}>
          <Geojson
            geojson={myPlaces}
            // strokeColor="red"
            // fillColor="green"
            // strokeWidth={2}
          />
        </MapView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  maps: {
    flex: 1,
    paddingHorizontal: 24,
  },
})
