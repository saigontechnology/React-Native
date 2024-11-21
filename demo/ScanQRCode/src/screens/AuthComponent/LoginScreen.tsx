import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react'
import {AppTextInput, ScreenContainer, showToast} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useDispatch} from 'react-redux'
import {appActions, userActions} from '../../store/reducers'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {getUserInfo} from '../../services/firestore'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.LoginScreen> & PropsWithChildren

export const LoginScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isLoginAllowed = useMemo(() => !!email && !!password, [email, password])

  const handleLoginSucceed = useCallback(
    async (user: FirebaseAuthTypes.UserCredential) => {
      const data = await getUserInfo(user?.user?.uid)
      showToast({type: 'SUCCESS', message: 'Logged in successfully!'})
      dispatch(
        userActions.setUserInfo({
          displayName: data?.displayName,
          email: user?.user?.email,
          uid: user?.user?.uid,
        }),
      )
      dispatch(appActions.setAppStack(RouteKey.HomeStack))
    },
    [dispatch],
  )

  const handleLogin = useCallback(() => {
    if (!!email && !!password) {
      Keyboard.dismiss()
      dispatch(appActions.setShowGlobalIndicator(true))
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(handleLoginSucceed)
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            showToast({type: 'ERROR', message: 'That email address is invalid!'})
            return
          }
          console.error(error)
          showToast({type: 'ERROR', message: JSON.stringify(error)})
        })
        .finally(() => dispatch(appActions.setShowGlobalIndicator(false)))
    }
  }, [dispatch, email, password, handleLoginSucceed])

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppTextInput label="Email" onChangeText={setEmail} />
        <AppTextInput
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          style={[styles.button, !isLoginAllowed && {backgroundColor: 'gray'}]}
          onPress={handleLogin}
          disabled={!isLoginAllowed}>
          <Text style={styles.loginLabel}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate(RouteKey.SignUpScreen, {})}>
          <Text style={[styles.loginLabel, {color: 'black'}]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  button: {
    height: 50,
    marginTop: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  signUpButton: {
    marginTop: 0,
    backgroundColor: 'white',
  },
  loginLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
})
