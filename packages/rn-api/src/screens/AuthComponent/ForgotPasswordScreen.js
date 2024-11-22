import React, {useCallback, useState} from 'react'
import {ScreenContainer, InputWithLabel} from '../../components'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import {responsiveHeight, colors} from '../../themes'
import {useDispatch} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {userActions} from '../../store/reducers'

export const ForgotPasswordScreen = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')

  const onForgotPassword = useCallback(() => {
    dispatch(userActions.forgotPasswordHandle({email}))
  }, [email, dispatch])

  const onChangeEmail = useCallback(text => {
    setEmail(text)
  }, [])

  return (
    <ScreenContainer style={styles.container}>
      <KeyboardAwareScrollView style={styles.contentSection}>
        <Text style={styles.titleText}>Forgot Password</Text>
        <InputWithLabel onChangeText={onChangeEmail} defaultValue={email} title={'Email'} />
        <TouchableOpacity style={styles.button} onPress={onForgotPassword}>
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
  contentSection: {
    width: '100%',
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
