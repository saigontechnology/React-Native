import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {PrimaryButton, Row, ScreenContainer} from '../../components'
import {RouteKey} from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {StyleSheet, View} from 'react-native'
import MapView, {Polygon, Polyline as PolyLineMap, PROVIDER_DEFAULT} from 'react-native-maps'
import {DEFAULT_LONGITUDE_DELTA, DEFAULT_LATITUDE_DELTA, DEFAULT_REGION} from '../../constants'
import {LocationData} from '../../store/types'
import {colors, deviceWidth, metrics} from '../../themes'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {runOnJS} from 'react-native-reanimated'
import Emitter from '../../utilities/Emitter'
import {Svg, Polyline} from 'react-native-svg'
import {pointInPolygon} from '../../utilities/geometry'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.CreateZoneScreen> & PropsWithChildren

type Point = {
  x: number
  y: number
}

export const CreateZoneScreen: React.FC<Props> = ({navigation}) => {
  const mapRef = useRef<MapView>(null)
  const [isZone, setIsZone] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDrawingEnd, setIsDrawingEnd] = useState(false)
  const [listCurrentDrawing, setListCurrentDrawing] = useState<{x: number; y: number}[]>([])
  const [listPoints, setListPoints] = useState<LocationData[]>([])
  const currentLocation = {
    longitude: DEFAULT_REGION.longitude,
    latitude: DEFAULT_REGION.latitude,
  }
  const listPointsDrawing = useRef<Point[]>([])
  const listPointsAccepted = useRef<Point[]>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Draw on map',
    })
  }, [navigation])

  const setNewPoints = (point: Point) => {
    if (listPointsDrawing.current.length) {
      const currentLastPoint = listPointsDrawing.current[listPointsDrawing.current.length - 1]
      // Only draw if next point is away from last point at least 10 range
      if (Math.abs(point.x - currentLastPoint.x) > 10 || Math.abs(point.y - currentLastPoint.y) > 10) {
        if (listPointsAccepted.current.length > 3) {
          if (!pointInPolygon({x: point.x, y: point.y}, listPointsAccepted.current)) {
            listPointsAccepted.current.push({x: point.x, y: point.y})
          }
        } else {
          listPointsAccepted.current.push({x: point.x, y: point.y})
        }
        listPointsDrawing.current.push({x: point.x, y: point.y})
        setListCurrentDrawing(prev => [...prev, {x: point.x, y: point.y}])
      }
      return
    }
    // set the first point if no point exists
    listPointsDrawing.current.push({x: point.x, y: point.y})
    setListCurrentDrawing(prev => [...prev, {x: point.x, y: point.y}])
  }

  const translatePointsToCoors = useCallback(async (points: Point[]) => {
    const listPointsPromise = points.map(
      item =>
        new Promise<LocationData>(resolve => {
          mapRef.current && resolve(mapRef.current.coordinateForPoint(item))
        }),
    )
    const listCoordinates = await Promise.all<LocationData>(listPointsPromise)
    if (listCoordinates.length) {
      setListPoints(listCoordinates)
    }
  }, [])

  useEffect(() => {
    Emitter.on('SET_MAP_LINE', setNewPoints)
    return () => {
      Emitter.rm('SET_MAP_LINE')
    }
  }, [])

  useEffect(() => {
    if (isDrawingEnd) {
      translatePointsToCoors(listPointsAccepted.current)
    }
  }, [isDrawingEnd, translatePointsToCoors])

  useEffect(() => {
    if (isDrawing) {
      setListCurrentDrawing([])
    }
  }, [isDrawing])

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onUpdate(e => {
      runOnJS(Emitter.emit)('SET_MAP_LINE', {x: Math.round(e.x), y: Math.round(e.y)})
    })
    .onEnd(() => {
      runOnJS(setIsDrawingEnd)(true)
    })

  const resetDrawingState = () => {
    listPointsDrawing.current = []
    listPointsAccepted.current = []
    setIsDrawingEnd(false)
    setListPoints([])
  }

  const handleEditZone = () => {
    setIsZone(true)
    resetDrawingState()
    setIsDrawing(prev => !prev)
  }

  const handleEditLine = () => {
    setIsZone(false)
    resetDrawingState()
    setIsDrawing(prev => !prev)
  }

  return (
    <ScreenContainer>
      <View style={styles.map}>
        <MapView
          rotateEnabled={!isDrawing || isDrawingEnd}
          zoomEnabled={!isDrawing || isDrawingEnd}
          scrollEnabled={!isDrawing || isDrawingEnd}
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            longitudeDelta: DEFAULT_LONGITUDE_DELTA,
            latitudeDelta: DEFAULT_LATITUDE_DELTA,
            ...currentLocation,
          }}>
          {!!listPoints?.length &&
            (isZone ? (
              <Polygon
                coordinates={listPoints}
                strokeWidth={metrics.borderWidthLarge}
                strokeColor={colors.red}
                fillColor={'transparent'}
                lineCap="round"
              />
            ) : (
              <PolyLineMap
                coordinates={listPoints}
                strokeWidth={metrics.borderWidthLarge}
                strokeColor={colors.red}
                lineCap="round"
              />
            ))}
        </MapView>
        {isDrawing && !isDrawingEnd && (
          <GestureDetector gesture={panGesture}>
            <View style={StyleSheet.absoluteFillObject}>
              <Svg style={styles.drawingView}>
                {!!listCurrentDrawing.length && (
                  <Polyline
                    points={listCurrentDrawing.map(item => `${item.x},${item.y}`).join(' ')}
                    fill="none"
                    stroke={colors.red}
                    strokeWidth={metrics.borderWidthLarge}
                  />
                )}
              </Svg>
            </View>
          </GestureDetector>
        )}

        <Row style={styles.buttonList}>
          {!isDrawing ? (
            <>
              <PrimaryButton text={'Draw Zone'} onPress={handleEditZone} style={styles.button} />
              <PrimaryButton
                backgroundColor={colors.primary}
                text={'Draw Line'}
                onPress={handleEditLine}
                style={[styles.button, {marginLeft: metrics.small}]}
              />
            </>
          ) : (
            <PrimaryButton
              backgroundColor={colors.gray}
              text={'Clear'}
              onPress={handleEditZone}
              style={styles.button}
            />
          )}
        </Row>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: 'relative',
  },
  buttonList: {
    position: 'absolute',
    bottom: metrics.xxl,
    width: deviceWidth(),
    paddingHorizontal: metrics.small,
  },
  button: {
    flex: 1,
  },
  icon: {
    height: metrics.iconMedium,
    aspectRatio: 1,
  },
  buttonContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: metrics.small,
    paddingTop: metrics.xxs,
  },
  drawingView: {
    flex: 1,
  },
})
