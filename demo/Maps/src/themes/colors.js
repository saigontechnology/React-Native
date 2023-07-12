const baseColor = {
  primary: '#65c8c6',
  black: '#1F1F1F',
  white: '#ffffff',
  gray: '#454545',
  red: '#ff0009',
  grayLight: '#858688',
  midnight: '#202124',
  background: '#F6F7FA',
  shamrock: '#2CCB8D',
  violet: '#5B378C',
  blackText: '#151B22',
  focusTextInput: '#9D76D3',
  gallery: '#F0F0F0',
  aluminium: '#A5A7B3',
  blueHaze: '#D7CFE2',
  blur: 'rgba(78, 78, 78, 0.77)',
  divider: '#f7f7f7',
  buttonAlertAction: '#edc95f',
  alto: '#D6D6D6',
  zircon: '#F5F7FF',
  cinderella: '#FCCDCA',
  sunsetOrange: '#FF4D4F',
  wildWaterMelon: '#FD4E85',
  ivory: '#FEFFF7',
  eggSour: '#FFF5DE',
  anakiwa: '#91D5FF',
  lilyWhite: '#E6F7FF',
  salmon: '#FF8066',
  purpleHeart: '#7938D4',
  lightPurple: '#9ea2ff',
  whiteIce: '#D3F8EA',
  tundora: '#464646',
  raisinBlack: '#262626',
  darkGray: '#999999',
  darkPurple: '#28A085',
  alabaster: '#FAFAFA',
  shadow: 'rgba(0,0,0,0.2)',
  westSide: '#FA8C16',
  border: '#E2E2E2',
  balticSea: '#252326',
  crusta: '#FA8B42',
  mercury: '#E7E7E7',
  silver: '#C8C8C8',
  dodgeBlue: '#1890FF',
  wildSand: '#F5F5F5',
  blackOpacity: 'rgba(0,0,0,0.5)',
  grayText: '#7F7F7F',
  busyStatusColor: '#c4314b',
  textDark: 'rgb(28, 28, 30)',
  textLight: 'rgb(255, 255, 255)',
  blue: '#0000FF',
  primaryBackground: '#161523',
  lightBlue: '#275BE7',
}

const colors = {
  ...baseColor,
}

const getColorOpacity = (color, opacity) => {
  if (opacity >= 0 && opacity <= 1 && color.includes('#')) {
    const hexValue = Math.round(opacity * 255).toString(16)
    return `${color.slice(0, 7)}${hexValue.padStart(2, '0').toUpperCase()}`
  }
  return color
}

export {colors, getColorOpacity}
