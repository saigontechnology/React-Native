import React, {useCallback, useReducer} from 'react'
import {ScreenContainer} from '../../components/ScreenContainer'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native'
import PasswordInput from '../../components/InputPassword'
import {responsiveHeight} from '../../themes/metrics'
import {colors} from '../../themes'
import {useDispatch} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {userActions} from '../../store/reducers'
import {navigate} from '../../navigation/NavigationService'
import RouteKey from '../../navigation/RouteKey'
import InputWIthLabel from '../../components/InputWIthLabel'

export const LoginScreen = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useReducer((prev, next) => ({...prev, ...next}), {
    email: '',
    password: '',
  })

  const onPressLogin = useCallback(() => {
    dispatch(userActions.userLogin())
  }, [dispatch])

  const onChangeEmail = useCallback(text => {
    setInputValue({email: text})
  }, [])

  const onChangePassword = useCallback(text => {
    setInputValue({password: text})
  }, [])

  return (
    <ScreenContainer style={styles.container}>
      <KeyboardAwareScrollView>
        <Text style={styles.titleText}>Login Screen</Text>
        <InputWIthLabel onChangeText={onChangeEmail} value={inputValue.id} title={'Email'} />
        <View style={styles.passwordSection}>
          <PasswordInput onChangeText={onChangePassword} value={inputValue.password} title="Password" />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigate(RouteKey.ChangePasswordScreen)
          }}>
          <Text style={styles.forgotPassword}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(RouteKey.ForgotPasswordScreen)
          }}>
          <Text style={styles.forgotPassword}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(RouteKey.ResetPasswordScreen)
          }}>
          <Text style={styles.forgotPassword}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressLogin}>
          <Text>SAVE</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: responsiveHeight(10),
    alignItems: 'center',
  },
  titleText: {
    fontSize: responsiveHeight(25),
    fontWeight: '600',
    marginVertical: responsiveHeight(20),
  },
  passwordSection: {
    marginTop: responsiveHeight(10),
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: responsiveHeight(40),
    marginTop: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  forgotPassword: {
    fontSize: responsiveHeight(18),
    marginVertical: responsiveHeight(10),
    alignSelf: 'flex-end',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
})
