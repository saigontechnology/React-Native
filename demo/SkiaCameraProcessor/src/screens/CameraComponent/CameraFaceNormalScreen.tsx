import {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, Button, View, useWindowDimensions} from 'react-native'
import {Frame, Camera as VisionCamera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera'
import {useIsFocused} from '@react-navigation/core'
import {Camera, Face, FaceDetectionOptions} from 'react-native-vision-camera-face-detector'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

export const CameraFaceNormalScreen: React.FC = () => {
  const {width, height} = useWindowDimensions()
  const {hasPermission, requestPermission} = useCameraPermission()
  const [cameraMounted, setCameraMounted] = useState<boolean>(false)
  const [cameraPaused, setCameraPaused] = useState<boolean>(false)
  const [facingFront, setFacingFront] = useState<boolean>(true)

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
    contourMode: 'all',
    windowWidth: width,
    windowHeight: height,
  }).current
  const isFocused = useIsFocused()
  const isCameraActive = !cameraPaused && isFocused
  const cameraDevice = useCameraDevice(facingFront ? 'front' : 'back')
  //
  // vision camera ref
  //
  const camera = useRef<VisionCamera>(null)
  //
  // face rectangle position
  //
  const aFaceW = useSharedValue(0)
  const aFaceH = useSharedValue(0)
  const aFaceX = useSharedValue(0)
  const aFaceY = useSharedValue(0)
  const rFaceX = useSharedValue(0)
  const rFaceY = useSharedValue(0)
  const rFaceZ = useSharedValue(0)
  const oFace = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 4,
    borderLeftColor: 'green',
    borderRightColor: 'green',
    borderBottomColor: 'green',
    borderTopColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: withTiming(oFace.value, {
      duration: 500,
    }),
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
    transform: [
      {
        rotateX: `${rFaceX.value}deg`,
      },
      {
        rotateY: `${-rFaceY.value}deg`,
      },
      {
        rotateZ: `${rFaceZ.value}deg`,
      },
    ],
  }))
  useEffect(() => {
    if (hasPermission) return
    requestPermission()
  }, [])

  /**
   * Hanldes camera mount error event
   *
   * @param {any} error Error event
   */
  function handleCameraMountError(error: any) {
    console.error('camera mount error', error)
  }

  /**
   * Handle detection result
   *
   * @param {Face[]} faces Detection result
   * @returns {void}
   */
  function handleFacesDetected(faces: Face[], frame: Frame): void {
    // if no faces are detected we do nothing
    if (Object.keys(faces).length <= 0) {
      oFace.value = 0
      return
    }
    const {bounds, pitchAngle, yawAngle, rollAngle, contours} = faces[0]
    const {width, height, x, y} = bounds
    aFaceW.value = width
    aFaceH.value = height
    aFaceX.value = x
    aFaceY.value = y
    rFaceX.value = pitchAngle
    rFaceY.value = yawAngle
    rFaceZ.value = rollAngle
    oFace.value = 1

    if (camera.current) {
      // take photo, capture video, etc...
    }
  }

  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        {hasPermission && cameraDevice ? (
          <>
            {cameraMounted && (
              <>
                <Camera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  isActive={isCameraActive}
                  device={cameraDevice}
                  resizeMode='contain'
                  onError={handleCameraMountError}
                  faceDetectionCallback={handleFacesDetected}
                  faceDetectionOptions={{
                    ...faceDetectionOptions,
                  }}
                />

                <Animated.View style={animatedStyle}>
                  {/* <Animated.Image source={Images.faceMask} style={animatedImageStyle} resizeMode="contain" /> */}
                  {/* <Text
                    style={{
                      color: 'rgba(0,0,255, 0.5)',
                      fontSize: 20,
                    }}>
                    This is the face
                  </Text> */}
                </Animated.View>

                {cameraPaused && (
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    Camera is PAUSED
                  </Text>
                )}
              </>
            )}

            {!cameraMounted && (
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: 'black',
                }}>
                Camera is NOT mounted
              </Text>
            )}
          </>
        ) : (
          <Text
            style={{
              width: '100%',
              backgroundColor: 'red',
              textAlign: 'center',
              color: 'white',
            }}>
            No camera device or permission
          </Text>
        )}
      </View>

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

          <Button
            onPress={() => setCameraPaused(current => !current)}
            title={`${cameraPaused ? 'Resume' : 'Pause'} Cam`}
          />

          <Button
            onPress={() => setCameraMounted(current => !current)}
            title={`${cameraMounted ? 'Unmount' : 'Mount'} Cam`}
          />
        </View>
      </View>
    </>
  )
}
