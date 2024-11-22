import {colors} from './colors'
import {FontSizes, metrics} from './metrics'

export * from './colors'
export * from './metrics'
export * from './fonts'
export * from './images'

export const APP_GENERAL_THEME = {
  components: {
    Button: {
      height: metrics.buttonHeight,
      disabledColor: colors.disabled,
    },
    ButtonPrimary: {
      backgroundColor: colors.primary,
      disabledColor: colors.disabled,
    },
    ButtonSecondary: {
      backgroundColor: colors.secondary,
      textColor: colors.primaryDark,
    },
    ButtonTransparent: {
      textColor: colors.primary,
    },
    ButtonOutline: {
      outlineColor: colors.primary,
      textColor: colors.primary,
    },
    Header: {
      titleStyle: FontSizes.title,
      height: metrics.headerHeight,
    },
  },
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
  },
  darkColors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
  },
}
