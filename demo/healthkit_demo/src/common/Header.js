/**
 * Created by NL on 07/06/2022.
 */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Colors, Images} from '../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from './Text';
import {responsiveWidth} from '../theme/Metrics';
import {Fonts} from '../theme/Fonts';

export const Header = ({title, centerStyle, leftStyle, rightView}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.leftView, leftStyle]}>
          <Image
            style={styles.backArrow}
            source={Images.backArrow}
            resizeMode={'contain'}
          />
        </View>
        <View style={[styles.centerView, centerStyle]}>
          <Text textStyle={styles.titleStyle}>{title}</Text>
        </View>
        <View style={[styles.rightView, rightView]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: responsiveWidth(16),
  },
  leftView: {
    flex: 1,
    justifyContent: 'center',
  },
  rightView: {
    flex: 1,
    justifyContent: 'center',
  },
  centerView: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: Fonts.SFSemiBold,
  },
  backArrow: {
    width: 18,
    height: 18,
  },
});
