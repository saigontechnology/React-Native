import {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, Button, View} from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera'
import {useIsFocused} from '@react-navigation/core'
import {BackdropFilter, Canvas, ColorMatrix, Rect, useImage} from '@shopify/react-native-skia'
import {Images} from '../../themes'

// https://kazzkiq.github.io/svg-color-filter/
const BLACK_AND_WHITE = [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0]

export const CameraFaceNormalSkiaScreen: React.FC = () => {
  const {hasPermission, requestPermission} = useCameraPermission()
  const [cameraMounted, setCameraMounted] = useState<boolean>(false)
  const [cameraPaused, setCameraPaused] = useState<boolean>(false)

  const isFocused = useIsFocused()
  const isCameraActive = !cameraPaused && isFocused
  const cameraDevice = useCameraDevice('front')
  //
  // vision camera ref
  //
  const camera = useRef<Camera>(null)

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
  const image = useImage(Images.landscape)

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
                  resizeMode="contain"
                  onError={handleCameraMountError}
                />
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
                <Canvas style={{width: 100, height: 200, opacity: 0.5}}>
                  <Rect x={0} y={0} width={100} height={100} color={'red'} />
                  <BackdropFilter
                    clip={{x: 0, y: 0, width: 100, height: 200}}
                    filter={<ColorMatrix matrix={BLACK_AND_WHITE} />}
                  />
                </Canvas>
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
          {!!cameraMounted && <Button onPress={() => {}} title={'Show Icon'} />}

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
