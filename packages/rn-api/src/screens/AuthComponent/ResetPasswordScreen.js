import React, {useCallback, useReducer} from 'react'
import {ScreenContainer} from '../../components/ScreenContainer'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native'
import PasswordInput from '../../components/InputPassword'
import {responsiveHeight} from '../../themes/metrics'
import {colors} from '../../themes'
import {useDispatch} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {userActions} from '../../store/reducers'
import InputWithLabel from '../../components/InputWithLabel'

export const ResetPasswordScreen = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useReducer((prev, next) => ({...prev, ...next}), {
    newPassword: '',
    confirmPassword: '',
    email: '',
  })

  const onResetPassword = useCallback(() => {
    dispatch(
      userActions.resetPasswordHandle({
        newPassword: inputValue.newPassword,
        confirmPassword: inputValue.confirmPassword,
        email: inputValue.email,
      }),
    )
  }, [inputValue, dispatch])

  const onChangeNewPass = useCallback(text => {
    setInputValue({newPassword: text})
  }, [])

  const onChangePassword = useCallback(text => {
    setInputValue({confirmPassword: text})
  }, [])

  const onChangeEmail = useCallback(text => {
    setInputValue({email: text})
  }, [])

  return (
    <ScreenContainer style={styles.container}>
      <KeyboardAwareScrollView>
        <Text style={styles.titleText}>Reset Password</Text>
        <PasswordInput onChangeText={onChangeNewPass} defaultValue={inputValue.id} title={'New Password'} />
        <View style={styles.passwordSection}>
          <PasswordInput
            onChangeText={onChangePassword}
            defaultValue={inputValue.password}
            title="Confirm Password"
          />
        </View>
        <View style={styles.passwordSection}>
          <InputWithLabel onChangeText={onChangeEmail} defaultValue={inputValue.id} title={'Email'} />
        </View>
        <TouchableOpacity style={styles.button} onPress={onResetPassword}>
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
