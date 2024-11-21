import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react'
import {AppTextInput, ScreenContainer, showToast} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useDispatch} from 'react-redux'
import {appActions, userActions} from '../../store/reducers'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {EMAIL_REGEX} from '../../constants'
import {saveUserInfo} from '../../services/firestore'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.SignUpScreen> & PropsWithChildren

export const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRePassword] = useState('')
  const [error, setError] = useState('')

  const isSignUpAllowed = useMemo(
    () => !!email && !!password && !!name && !!repassword,
    [email, password, name, repassword],
  )

  const handleSignUpSucceed = useCallback(
    async (user: FirebaseAuthTypes.UserCredential) => {
      await saveUserInfo(user?.user?.uid, name)
      showToast({type: 'SUCCESS', message: 'Signed up successfully!'})
      dispatch(
        userActions.setUserInfo({
          displayName: name,
          email: user?.user?.email,
          uid: user?.user?.uid,
        }),
      )
      dispatch(appActions.setAppStack(RouteKey.HomeStack))
    },
    [dispatch, name],
  )

  const validateInputs = useCallback(() => {
    if (!email.match(EMAIL_REGEX)) {
      setError('Invalid email format!')
      return false
    }
    if (password !== repassword) {
      setError('Passwords do not match!')
      return false
    }
    return true
  }, [email, password, repassword])

  const handleSignUp = useCallback(() => {
    if (validateInputs()) {
      Keyboard.dismiss()
      dispatch(appActions.setShowGlobalIndicator(true))
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(handleSignUpSucceed)
        .catch(err => {
          if (err.code === 'auth/invalid-email') {
            showToast({
              type: 'ERROR',
              message: 'Email address is invalid!',
            })
            return
          }
          if (err.code === 'auth/email-already-in-use') {
            showToast({
              type: 'ERROR',
              message: 'This email is already in use!',
            })
            return
          }
          console.error(err)
          showToast({
            type: 'ERROR',
            message: JSON.stringify(err),
          })
        })
        .finally(() => dispatch(appActions.setShowGlobalIndicator(false)))
    }
  }, [validateInputs, dispatch, email, password, handleSignUpSucceed])

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppTextInput label="Email" onChangeText={setEmail} />
        <AppTextInput label="Name" onChangeText={setName} />
        <AppTextInput label="Password" secureTextEntry onChangeText={setPassword} />
        <AppTextInput
          label="Confirm Password"
          secureTextEntry
          onChangeText={setRePassword}
          onSubmitEditing={handleSignUp}
        />
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.button, !isSignUpAllowed && {backgroundColor: 'gray'}]}
          onPress={handleSignUp}
          disabled={!isSignUpAllowed}>
          <Text style={styles.loginLabel}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={() => navigation.goBack()}>
          <Text style={[styles.loginLabel, {color: 'black'}]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  button: {
    height: 50,
    marginTop: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  signInButton: {
    marginTop: 0,
    backgroundColor: 'white',
  },
  loginLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
  },
})
