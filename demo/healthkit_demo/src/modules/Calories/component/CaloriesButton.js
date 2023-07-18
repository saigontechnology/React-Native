/**
 * Created by NL on 07/06/2022.
 */
import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../../theme';
import {responsiveHeight, responsiveWidth} from '../../../theme/Metrics';
import {Text} from '../../../common';
import {Fonts} from '../../../theme/Fonts';

export const CaloriesButton = ({
  containerStyle,
  icon,
  text,
  unit,
  value,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      <Image style={styles.icon} source={icon} resizeMode={'contain'} />
      <View style={styles.textContainer}>
        <Text textStyle={styles.text}>{text}</Text>
        <Text textStyle={styles.value}>
          {value} {unit && <Text textStyle={styles.unit}>{` ${unit}`}</Text>}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(20),
    borderRadius: 4,
  },
  icon: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
  },
  textContainer: {
    marginLeft: responsiveWidth(15),
  },
  text: {
    fontSize: 13,
    color: Colors.grayText,
    marginBottom: responsiveHeight(4),
  },
  value: {
    color: Colors.blackText,
    fontSize: 18,
    fontFamily: Fonts.SFMedium,
  },
  unit: {
    fontFamily: Fonts.SFMedium,
  },
});
