import React from 'react'
import ScreenContainer from '../../components/ScreenContainer'
import {StyleSheet} from 'react-native'

import {responsiveHeight} from '../../themes/metrics'

export const LoginScreen = () => <ScreenContainer style={styles.container} />

const styles = StyleSheet.create({
  container: {
    padding: responsiveHeight(10),
    alignItems: 'center',
  },
})
