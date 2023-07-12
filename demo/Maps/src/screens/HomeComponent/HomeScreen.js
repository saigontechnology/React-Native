import React, {useCallback, useRef, useState, useEffect} from 'react'
import {View, StyleSheet} from 'react-native'
import MapView, {Marker, UrlTile, Polyline, PROVIDER_DEFAULT, MAP_TYPES} from 'react-native-maps'
import BottomSheetComponent from './components/BottomSheet'

const animatedCoordinates = [
  {
    latitude: 21.016966,
    longitude: 105.840567,
  },
  {
    latitude: 20.207814,
    longitude: 106.208781,
  },
  {
    latitude: 19.447375,
    longitude: 105.751899,
  },
  {
    latitude: 17.561764,
    longitude: 106.509955,
  },
  {
    latitude: 16.113321,
    longitude: 108.116706,
  },
  {
    latitude: 12.883052,
    longitude: 109.364936,
  },
  {
    latitude: 10.794637,
    longitude: 106.785787,
  },
]

const HomeScreen = () => {
  const mapRef = useRef(null)

  const [drawnCoordinates, setDrawnCoordinates] = useState([])
  const [isOSM, setIsOSM] = useState(true)

  const [coordinates] = useState([
    {
      latitude: 21.016966,
      longitude: 105.840567,
    },
    {
      latitude: 10.794637,
      longitude: 106.785787,
    },
  ])

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < animatedCoordinates.length) {
        const coordinate = animatedCoordinates[currentIndex]
        setDrawnCoordinates(prevCoordinates => [...prevCoordinates, coordinate])
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const modalRef = useRef(null)
  const onHandleModal = useCallback(() => {
    modalRef.current?.openModal()
  }, [])

  const onPressLocation = useCallback(() => {
    const initialRegion = {
      latitude: coordinates[0].latitude,
      longitude: coordinates[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    mapRef.current.animateToRegion(initialRegion, 1000)
  }, [coordinates])

  const onPressAppleMap = useCallback(() => {
    if (isOSM) {
      setIsOSM(prev => !prev)
    }
  }, [isOSM])

  const onPressOSM = useCallback(() => {
    if (!isOSM) {
      setIsOSM(prev => !prev)
    }
  }, [isOSM])

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        ref={mapRef}
        style={[{...StyleSheet.absoluteFill}]}>
        {isOSM ? (
          <UrlTile
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            doubleTileSize={true}
            tileSize={384}
            maximumZ={18}
            shouldReplaceMapContent={true}
            zIndex={-1}
          />
        ) : null}
        <Marker coordinate={coordinates[0]} />
        <Marker coordinate={coordinates[1]} />
        <Polyline
          coordinates={drawnCoordinates}
          strokeColor="yellow" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={5}
        />
      </MapView>
      <BottomSheetComponent
        onPressLocation={onPressLocation}
        onSwipe={onHandleModal}
        onPressAppleMap={onPressAppleMap}
        onPressOSM={onPressOSM}
        isOSM={isOSM}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderStartColor: 'red',
  },
})

export default HomeScreen
