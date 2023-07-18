/**
 * Created by NL on 07/06/2022.
 */
import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../../theme/Metrics';
import {Colors} from '../../../theme';
import {Images} from '../../../theme/Images';
import {Text} from '../../../common';
import {Fonts} from '../../../theme/Fonts';

export const CaloriesWeekComponent = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrowButton}>
        {<Image style={styles.arrowStyle} source={Images.previousArrow} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.center}>
        <Text textStyle={styles.text}>Last Week</Text>
        <Image
          style={styles.arrowDownStyle}
          source={Images.arrowDown}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowButton}>
        {<Image style={styles.arrowStyle} source={Images.nextArrow} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: responsiveHeight(44),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: Colors.borderColor,
    borderLeftColor: Colors.borderColor,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  arrowButton: {
    width: responsiveWidth(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowStyle: {
    width: responsiveWidth(8),
    height: responsiveHeight(10),
  },
  arrowDownStyle: {
    width: responsiveWidth(10),
    height: responsiveHeight(13),
    marginLeft: responsiveWidth(10),
  },
  text: {
    fontFamily: Fonts.SFMedium,
    fontSize: 14,
  },
});
