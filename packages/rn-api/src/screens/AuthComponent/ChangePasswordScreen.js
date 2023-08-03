import React, {useCallback, useReducer} from 'react'
import {ScreenContainer} from '../../components/ScreenContainer'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native'
import PasswordInput from '../../components/InputPassword'
import {responsiveHeight} from '../../themes/metrics'
import {colors} from '../../themes'
import {useDispatch} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {userActions} from '../../store/reducers'

export const ChangePasswordScreen = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useReducer((prev, next) => ({...prev, ...next}), {
    newPassword: '',
    confirmPassword: '',
    oldPassword: '',
  })

  const onSaveChangePassword = useCallback(() => {
    dispatch(
      userActions.changePasswordHandle({
        newPassword: inputValue.newPassword,
        confirmPassword: inputValue.confirmPassword,
        oldPassword: inputValue.oldPassword,
      }),
    )
  }, [inputValue, dispatch])

  const onChangeNewPass = useCallback(text => {
    setInputValue({newPassword: text})
  }, [])

  const onChangePassword = useCallback(text => {
    setInputValue({confirmPassword: text})
  }, [])

  const onChangeOldPassword = useCallback(text => {
    setInputValue({oldPassword: text})
  }, [])

  return (
    <ScreenContainer style={styles.container}>
      <KeyboardAwareScrollView>
        <Text style={styles.titleText}>Change Password</Text>
        <PasswordInput onChangeText={onChangeNewPass} defaultValue={inputValue.id} title={'New Password'} />
        <View style={styles.passwordSection}>
          <PasswordInput
            onChangeText={onChangePassword}
            defaultValue={inputValue.password}
            title="Confirm Password"
          />
        </View>
        <View style={styles.passwordSection}>
          <PasswordInput
            onChangeText={onChangeOldPassword}
            defaultValue={inputValue.password}
            title="Old Password"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onSaveChangePassword}>
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
