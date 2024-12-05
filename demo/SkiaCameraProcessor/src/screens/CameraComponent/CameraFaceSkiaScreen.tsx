import {Button, StyleSheet, Text, useWindowDimensions, View} from 'react-native'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {
  Camera,
  runAsync,
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera'
import {useFaceDetector} from 'react-native-vision-camera-face-detector'
import type {Face, FaceDetectionOptions} from 'react-native-vision-camera-face-detector'
import {Worklets} from 'react-native-worklets-core'
import {Skia} from '@shopify/react-native-skia'
import {current} from '@reduxjs/toolkit'

const invertColorsFilter = Skia.RuntimeEffect.Make(`
  uniform shader image;
  half4 main(vec2 pos) {
    vec4 color = image.eval(pos);
    return vec4((1.0 - color).rgb, 1.0);
  }
`)!
const paintCorupt = Skia.Paint()
const shaderInvertBuilder = Skia.RuntimeShaderBuilder(invertColorsFilter)
const imageInverFilter = Skia.ImageFilter.MakeRuntimeShader(shaderInvertBuilder, null, null)
paintCorupt.setImageFilter(imageInverFilter)

const colorBrightFilter = Skia.ColorFilter.MakeMatrix([
  1.12, -0.12, 0.101, 0.0, 0.076, 0.067, 1.05, -0.015, 0.0, 0.076, 0.067, -0.12, 1.15, 0.0, 0.076, 0.1, 0.0,
  0.0, 1.0, 0.0,
])
const paintBright = Skia.Paint()
paintBright.setColorFilter(colorBrightFilter)

const colorBWFilter = Skia.ColorFilter.MakeMatrix([
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
])
const paintBlackWhite = Skia.Paint()
paintBlackWhite.setColorFilter(colorBWFilter)

const imageCoruptFilter = Skia.RuntimeEffect.Make(`
  uniform shader image;
  half4 main(float2 xy) {   
    xy.x += sin(xy.y / 3) * 4;
    return image.eval(xy).rbga;
  }`)!

const paintDisrupt = Skia.Paint()
const shaderCorruptBuilder = Skia.RuntimeShaderBuilder(imageCoruptFilter)
const imageFilter = Skia.ImageFilter.MakeRuntimeShader(shaderCorruptBuilder, null, null)
paintDisrupt.setImageFilter(imageFilter)

const PaintList = [Skia.Paint(), paintCorupt, paintBright, paintDisrupt, paintBlackWhite]
export const CameraFaceSkiaScreen: React.FC = () => {
  const {width, height} = useWindowDimensions()
  const [paintIndex, setPaintIndex] = useState(0)
  const [showFace, setShowFace] = useState(false)

  const paint = useMemo(() => PaintList[paintIndex], [paintIndex])

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate',
    classificationMode: 'all',
    windowWidth: width,
    windowHeight: height - 60,
  }).current
  const [location, setLocation] = useState<null | Face['bounds']>(null)
  const {hasPermission, requestPermission} = useCameraPermission()

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission])

  const device = useCameraDevice('front')
  const {detectFaces} = useFaceDetector(faceDetectionOptions)

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (faces.length) {
      const currentFace = faces[0]
      setLocation(prev => {
        if (prev?.x !== currentFace.bounds.x || prev?.y !== currentFace.bounds.y) {
          return currentFace.bounds
        }
        return prev
      })
      return
    }
    setLocation(null)
  })

  const frameProcessor = useSkiaFrameProcessor(
    frame => {
      'worklet'
      frame.render(paint)
      runAsync(frame, () => {
        'worklet'
        const faces = detectFaces(frame)
        const flipFaces = faces?.map?.(item => ({
          ...item,
          bounds: {
            ...(item.bounds || {}),
            x: frame.width - (item.bounds.x + item.bounds.width * 2),
          },
        }))
        handleDetectedFaces(flipFaces)
      })
    },
    [handleDetectedFaces, paint],
  )

  return (
    <View style={{flex: 1}}>
      {device ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          frameProcessor={frameProcessor}
          resizeMode="contain"
        />
      ) : (
        <Text>No Device</Text>
      )}
      {!!location && showFace && (
        <View
          style={{
            width: location.width,
            height: location.height,
            position: 'absolute',
            top: location.y,
            left: location.x,
            borderWidth: 1,
            borderColor: 'yellow',
          }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Button onPress={() => setPaintIndex(0)} title={'No effect'} />
          <Button onPress={() => setPaintIndex(2)} title={'Brighter'} />
          <Button onPress={() => setPaintIndex(4)} title={'Black & White'} />
        </View>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 10,
          }}>
          <Button onPress={() => setPaintIndex(3)} title={'Disrupt'} />
          <Button onPress={() => setPaintIndex(1)} title={'Corrupt'} />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Button onPress={() => setShowFace(prev => !prev)} title={showFace ? 'Hide face' : 'Show face'} />
        </View>
      </View>
    </View>
  )
}
