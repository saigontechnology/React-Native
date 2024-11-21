import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState} from 'react'
import auth from '@react-native-firebase/auth'
import QRCode from 'react-native-qrcode-svg'
import {useCameraPermission} from 'react-native-vision-camera'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {appActions, userActions} from '../../store/reducers'
import {getUserInfo} from '../../store/selectors'
import {deviceWidth} from '../../themes'
import {formatRemainingTime} from '../../utilities/utils'
import {encryptText} from '../../services/crypto'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.HomeScreen> & PropsWithChildren

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(getUserInfo)
  const {hasPermission, requestPermission} = useCameraPermission()
  const [timestamp, setTimestamp] = useState(Date.now())
  const [remainingTime, setRemainingTime] = useState(90)

  const qrValue = useMemo(
    () =>
      encryptText(
        `qrapp:/${currentUser?.uid}/${currentUser?.displayName}/${currentUser?.email}/${timestamp}`,
      ),
    [currentUser, timestamp],
  )

  const openScanner = useCallback(() => {
    if (hasPermission) {
      navigation.navigate(RouteKey.CameraScreen, {})
    } else {
      requestPermission().then(() => {
        navigation.navigate(RouteKey.CameraScreen, {})
      })
    }
  }, [hasPermission, navigation, requestPermission])

  const handleLogout = useCallback(() => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
      })
    dispatch(userActions.setUserInfo({}))
    dispatch(appActions.setAppStack(RouteKey.AuthStack))
  }, [dispatch])

  useEffect(() => {
    const runner = setInterval(() => {
      setTimestamp(Date.now())
      setRemainingTime(90)
    }, 90000)

    return () => clearInterval(runner)
  }, [])

  useEffect(() => {
    const qrExpirer = setInterval(() => {
      setRemainingTime(prev => prev - 1)
    }, 1000)

    return () => clearInterval(qrExpirer)
  }, [timestamp])

  return (
    <ScreenContainer hasBackButton>
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>{currentUser?.uid}</Text>
          <Text style={styles.text}>{currentUser?.email}</Text>
          <Text style={styles.text}>{currentUser?.displayName}</Text>
        </View>

        <View style={styles.qr}>
          <QRCode value={`${qrValue}`} size={deviceWidth() * 0.6} />
          <Text style={styles.text}>New QR code in {formatRemainingTime(remainingTime)}</Text>
        </View>

        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.button} onPress={openScanner}>
            <Text style={styles.loginLabel}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#384a3d'}]}
            onPress={() => navigation.navigate(RouteKey.RecordScreen, {})}>
            <Text style={styles.loginLabel}>Scan Records</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {backgroundColor: '#fff'}]} onPress={handleLogout}>
            <Text style={[styles.loginLabel, {color: 'black'}]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  )
}

export {HomeScreen}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 56,
    paddingTop: 150,
    // justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  qr: {
    gap: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonStack: {
    gap: 24,
    bottom: 24,
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  loginLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
})
