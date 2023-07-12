import React from 'react'
import {StyleSheet, View} from 'react-native'
import {responsiveWidth} from '../themes/metrics'
import {colors} from '../themes'

function Circle({style, children, contentStyle}) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 60,
  },
  content: {
    padding: 8,
  },
})

export default React.memo(Circle)
