import {Dimensions, Platform} from 'react-native'

const DESIGN_WIDTH = 375
const DESIGN_HEIGHT = 812
const {width, height} = Dimensions.get('window')

function responsiveWidth<T extends number>(value: T) {
  return ((width * value) / DESIGN_WIDTH) as T
}

function responsiveHeight<T extends number>(value: T) {
  return ((height * value) / DESIGN_HEIGHT) as T
}

function responsiveFont<T extends number>(value: T) {
  return ((width * value) / DESIGN_WIDTH) as T
}

function deviceWidth(): number {
  return width
}

function deviceHeight(): number {
  return height
}

const isIOS: boolean = Platform.OS === 'ios'

const shadow = {
  shadowColor: '#000',
  shadowRadius: 5,
  elevation: 5,
  shadowOpacity: 0.2,
  shadowOffset: {width: 0, height: 3},
} as const
const hitSlop = {
  top: 10,
  bottom: 10,
  right: 10,
  left: 10,
} as const

const metrics = {
  // Text Size
  title: responsiveFont(20),
  span: responsiveFont(14),

  // spacing
  tiny: responsiveHeight(4),
  xxxs: responsiveHeight(6),
  xxs: responsiveHeight(8),
  xs: responsiveHeight(12),
  small: responsiveHeight(16),
  sMedium: responsiveHeight(18),
  medium: responsiveHeight(20),
  large: responsiveHeight(24),
  xl: responsiveHeight(28),
  xxl: responsiveHeight(32),
  xxxl: responsiveHeight(40),
  huge: responsiveHeight(48),
  massive: responsiveHeight(64),

  borderRadius: responsiveHeight(5),
  borderRadiusLarge: responsiveHeight(10),
  borderRadiusHuge: responsiveHeight(20),
  // margin
  marginTop: responsiveHeight(12),
  marginHorizontal: responsiveWidth(24),
  marginVertical: responsiveWidth(16),
  paddingHorizontal: responsiveWidth(20),

  zero: 0,

  voucherBorderRadius: responsiveHeight(15),
  logoWidth: responsiveWidth(300),
  logoHeight: responsiveHeight(70),
  icon: responsiveHeight(30),
  iconMedium: responsiveHeight(24),
  iconLarge: responsiveHeight(32),
  shadowLocationInner: responsiveHeight(54),
  buttonIconHeight: responsiveHeight(48),
  headerHeight: responsiveHeight(48),
  buttonHeight: responsiveHeight(40),
  borderWidth: responsiveHeight(1),
  borderWidthLarge: responsiveWidth(2),
  dropdownHeight: responsiveHeight(36),
} as const

const FontSizes = {
  small: responsiveFont(12),
  span: responsiveFont(14),
  body: responsiveFont(16),
  large: responsiveFont(18),
  title: responsiveFont(20),
} as const

export {
  metrics,
  FontSizes,
  isIOS,
  shadow,
  hitSlop,
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
  deviceWidth,
  deviceHeight,
}
