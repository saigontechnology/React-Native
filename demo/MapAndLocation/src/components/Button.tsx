import {StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle} from 'react-native'
import React, {ReactNode} from 'react'
import {ButtonPrimary, ButtonSecondary, ButtonTransparent} from 'rn-base-component'
import {ButtonProps} from 'rn-base-component/lib/typescript/components/Button/Button'
import {colors, metrics, shadow} from '../themes'

export const PrimaryButton: React.FC<ButtonProps & {text?: string}> = ({
  style,
  disabled = false,
  textStyle,
  textColor = colors.white,
  text,
  children,
  ...rest
}) => {
  const color = disabled ? colors.textInputDisabled : textColor
  return (
    <ButtonPrimary
      {...rest}
      style={[styles.buttonContainer, StyleSheet.flatten(style)]}
      textStyle={[{color}, StyleSheet.flatten(textStyle)]}
      disabled={disabled}
      borderRadius={metrics.borderRadius}>
      {text ? text : children}
    </ButtonPrimary>
  )
}

export const SecondaryButton: React.FC<ButtonProps & {text?: string}> = ({
  style,
  textColor = colors.primary,
  textStyle,
  text,
  children,
  ...rest
}) => (
  <ButtonSecondary
    {...rest}
    style={[styles.buttonContainer, StyleSheet.flatten(style)]}
    textStyle={[{color: textColor}, StyleSheet.flatten(textStyle)]}
    borderRadius={metrics.borderRadius}>
    {text ? text : children}
  </ButtonSecondary>
)

export const ClearButton: React.FC<ButtonProps & {text?: string}> = ({
  style,
  textStyle,
  textColor = colors.primary,
  text,
  children,
  ...rest
}) => (
  <ButtonTransparent
    {...rest}
    style={[styles.buttonContainer, StyleSheet.flatten(style)]}
    textStyle={[{color: textColor}, StyleSheet.flatten(textStyle)]}>
    {text ? text : children}
  </ButtonTransparent>
)

interface IconButtonProps extends TouchableOpacityProps {
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  borderRadius?: number
  iconComponent?: ReactNode
  hasShadow?: boolean
}

export const IconButton: React.FC<IconButtonProps> = ({
  containerStyle,
  style,
  backgroundColor = colors.white,
  borderRadius = metrics.borderRadius,
  hasShadow = true,
  iconComponent,
  ...rest
}) => (
  <View style={containerStyle}>
    <TouchableOpacity
      style={[
        styles.buttonIcon,
        {backgroundColor, borderRadius},
        hasShadow && shadow,
        StyleSheet.flatten(style),
      ]}
      {...rest}>
      {!!iconComponent && iconComponent}
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buttonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: metrics.buttonIconHeight,
    aspectRatio: 1,
  },
})
