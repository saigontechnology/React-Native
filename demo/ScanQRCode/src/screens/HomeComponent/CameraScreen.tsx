import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useRef, useState} from 'react'
import {ScreenContainer, showToast} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {View, StyleSheet} from 'react-native'
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera'
import {useSelector} from 'react-redux'
import {deviceHeight} from '../../themes'
import {Record, saveNewRecord} from '../../services/firestore'
import {getUserInfo} from '../../store/selectors'
import {decryptText} from '../../services/crypto'
import {ResultModal} from './components/ResultModal'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.CameraScreen> & PropsWithChildren

const SCAN_TIMEOUT = 5000
const BOX_SIZE = deviceHeight() / 4 + 24

const validateQrValue = (value: string) => {
  const decryptedValue = decryptText(value)
  if (decryptedValue?.startsWith('qrapp:') && decryptedValue?.split('/').length) {
    return {
      result: true,
      data: {
        id: decryptedValue.split('/')[1],
        name: decryptedValue.split('/')[2],
        email: decryptedValue.split('/')[3],
        time: Date.now().toString(),
      },
    }
  }
  return {
    result: false,
  }
}

export const CameraScreen: React.FC<Props> = () => {
  const cameraRef = useRef<Camera>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | undefined>()
  const currentUser = useSelector(getUserInfo)
  const device = useCameraDevice('back')
  const [result, setResult] = useState<undefined | {name: string; email: string}>(undefined)

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async codes => {
      if (codes?.length && !scanTimeoutRef.current) {
        scanTimeoutRef.current = setTimeout(() => {
          clearTimeout(scanTimeoutRef.current)
          scanTimeoutRef.current = undefined
        }, SCAN_TIMEOUT)

        const validation = validateQrValue(codes[0]?.value as string)
        if (validation.result) {
          await saveNewRecord(
            currentUser?.uid,
            currentUser?.email,
            currentUser?.displayName,
            validation.data as unknown as Record,
          )
          setResult({name: validation.data?.name || '', email: validation.data?.email || ''})
          showToast({
            type: 'SUCCESS',
            message: 'Data detected!',
          })
        }
      }
    },
  })

  return (
    <ScreenContainer hasBackButton>
      <View style={styles.container}>
        {!!device && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            codeScanner={codeScanner}
            photo
            isActive={!result}
          />
        )}
        <View style={styles.topBlock} />
        <View style={styles.bottomBlock} />
        <View style={styles.leftBlock} />
        <View style={styles.rightBlock} />
      </View>
      {!!result?.name && (
        <ResultModal
          visible={true}
          name={result?.name}
          email={result?.email}
          closeCallback={() => setResult(undefined)}
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  scanner: {
    flex: 1,
    zIndex: 1000,
    // width: '80%',
    // alignSelf: 'center',
    // height: 340,
    // zIndex: 1000,
    // backgroundColor: 'white',
  },
  topBlock: {
    top: 0,
    height: BOX_SIZE,
    width: '100%',
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomBlock: {
    bottom: 0,
    height: BOX_SIZE,
    width: '100%',
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  leftBlock: {
    left: 0,
    width: 40,
    zIndex: 100,
    top: BOX_SIZE,
    bottom: BOX_SIZE,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  rightBlock: {
    right: 0,
    width: 40,
    top: BOX_SIZE,
    bottom: BOX_SIZE,
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})
