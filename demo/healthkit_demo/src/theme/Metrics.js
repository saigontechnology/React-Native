/**
 * Created by NL on 07/06/2022.
 */
import {Dimensions, Platform} from 'react-native';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 730;
const {width, height} = Dimensions.get('window');

export const responsiveWidth = (value = 0) => {
  return (width * value) / DESIGN_WIDTH;
};

export const responsiveHeight = (value = 0) => {
  return (height * value) / DESIGN_HEIGHT;
};

export const responsiveFont = (value = 0) => {
  return (width * value) / DESIGN_WIDTH;
};

export const deviceWidth = () => {
  return width;
};

export const deviceHeight = () => {
  return height;
};

export const isIOS = () => {
  return Platform.OS === 'ios';
};
