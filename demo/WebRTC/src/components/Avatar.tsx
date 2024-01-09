import React from 'react'
import {View, StyleSheet, StyleProp, ViewStyle, Text, TextStyle} from 'react-native'
import {colors, fonts, metrics} from '../themes'

interface IAvatarProps {
  title: string
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  size?: number
}

export const Avatar = ({title, style, titleStyle, size = metrics.massive + metrics.large}: IAvatarProps) => (
  <View
    style={[
      styles.avatar,
      style,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
    ]}>
    <Text style={[styles.title, titleStyle]}>{title}</Text>
  </View>
)

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray,
  },
  title: {
    fontSize: metrics.small,
    color: colors.white,
    fontFamily: fonts.bold,
  },
})
