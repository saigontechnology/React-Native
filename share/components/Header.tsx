import React from 'react'
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native'
import {Text} from 'rn-base-component'
import {useNavigation} from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {colors, fonts, fontSizes, metrics} from '../themes'

interface IHeaderProp {
  title?: string
  leftStyle?: StyleProp<ViewStyle>
  centerStyle?: StyleProp<ViewStyle>
  rightStyle?: StyleProp<ViewStyle>
  onGoBack?: () => void
  hasBackButton?: boolean
  leftView?: React.ReactNode
  centerView?: React.ReactNode
  rightView?: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
}

export const Header: React.FC<IHeaderProp> = ({
  hasBackButton = true,
  title,
  leftStyle,
  rightStyle,
  centerStyle,
  onGoBack,
  leftView,
  centerView,
  rightView,
  containerStyle,
}) => {
  const navigation = useNavigation()
  return (
    <View style={[styles.headerStyle, containerStyle]}>
      <View style={[styles.left, leftStyle]}>
        {hasBackButton && (
          <TouchableOpacity
            onPress={() => {
              if (onGoBack) {
                onGoBack()
              } else {
                navigation.goBack()
              }
            }}>
            <MaterialIcons name={'arrow-back'} color={colors.black} size={25} />
          </TouchableOpacity>
        )}
        {leftView}
      </View>
      <View style={[styles.center, centerStyle]}>
        {!!title && (
          <Text fontSize={fontSizes.label} fontFamily={fonts.bold} color={colors.black}>
            {title}
          </Text>
        )}
        {centerView}
      </View>
      <View style={[styles.right, rightStyle]}>{rightView}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: metrics.headerHeight,
    paddingHorizontal: metrics.marginTop,
    backgroundColor: colors.white,
    borderBottomWidth: metrics.borderWidth,
    borderColor: colors.gray1,
  },
  left: {
    flex: 1,
  },
  center: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
  },
})
