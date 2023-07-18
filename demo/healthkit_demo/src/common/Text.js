/**
 * Created by NL on 07/06/2022.
 */
import React from 'react';
import {Text as TextNative, StyleSheet} from 'react-native';
import {responsiveFont} from '../theme/Metrics';
import {Fonts} from '../theme/Fonts';

export const Text = ({textStyle, children, ...rest}) => {
  return <TextNative style={[styles.text, textStyle]}>{children}</TextNative>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontFamily: Fonts.SFRegular,
  },
});
