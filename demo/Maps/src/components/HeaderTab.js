import React from 'react'
import {StyleSheet, Text} from 'react-native'
import {responsiveHeight} from '../themes/metrics'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {colors} from '../themes'

function HeaderTab({value, onPress, title, style, styleText, ...rest}) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[styles.container, style]}>
      <Text style={[styles.titleText, styleText]}>{title ?? ''}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gallery,
    borderRadius: 25,
    width: '100%',
    flexDirection: 'row',
  },
  titleText: {
    padding: responsiveHeight(15),
    color: colors.grayText,
    fontSize: responsiveHeight(18),
  },
})

export default React.memo(HeaderTab)
