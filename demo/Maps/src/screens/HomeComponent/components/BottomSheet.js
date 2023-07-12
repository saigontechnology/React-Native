import React, {useMemo, useCallback, useRef, useState} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {colors, deviceHeight, responsiveHeight, responsiveWidth} from '../../../themes'
import {goBack} from '../../../navigation/NavigationService'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'

const ICON_LOCATION_POSITION_HEIGHT = deviceHeight() / 2

function BottomSheetComponent({loading, onPressLocation, onPressAppleMap, onPressOSM, isOSM}) {
  // ref
  const bottomSheetRef = useRef(null)
  const [viewChange, setChangeView] = useState(null)
  const animatedPosition = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    if (animatedPosition.value < 120) {
      runOnJS(setChangeView)(true)
    } else {
      runOnJS(setChangeView)(false)
    }
    return {
      transform: [
        {
          translateY: withSpring(
            animatedPosition.value < ICON_LOCATION_POSITION_HEIGHT
              ? ICON_LOCATION_POSITION_HEIGHT
              : animatedPosition.value,
            {
              damping: 150,
              stiffness: 400,
            },
          ),
        },
      ],
    }
  })

  // variables
  const snapPoints = useMemo(() => ['20%', '50%'], [])

  const onPressGoBack = useCallback(() => {
    goBack()
  }, [])

  const CustomHandle = useCallback(
    () =>
      (
        <View style={styles.handleView}>
          <View style={styles.handleLeftSection}>
            <Text style={styles.number}>12</Text>
            <View style={styles.timeSection}>
              <Text style={styles.monthsText}>December</Text>
              <Text style={styles.serialText}>N95899</Text>
            </View>
          </View>
          <View style={styles.moneySection}>
            <FontAwesome name={'dollar'} color={colors.white} size={22} />
            <Text style={styles.money}>65.00</Text>
          </View>
        </View>
      )[(viewChange, loading)],
  )

  return (
    <>
      <TouchableOpacity onPress={onPressGoBack} activeOpacity={0.7} style={styles.backArrowView}>
        <MaterialIcons style={styles.backArrow} name={'arrow-back-ios'} size={20} />
      </TouchableOpacity>
      <Animated.View style={[animatedStyle, {alignItems: 'flex-end'}]}>
        <TouchableOpacity onPress={onPressLocation} activeOpacity={0.7} style={styles.locationIcon}>
          <MaterialIcons name={'my-location'} size={30} />
        </TouchableOpacity>
      </Animated.View>
      <BottomSheet
        handleHeight={0}
        ref={bottomSheetRef}
        index={0}
        handleComponent={CustomHandle}
        snapPoints={snapPoints}
        enableContentPanningGesture
        enableHandlePanningGesture
        animatedPosition={animatedPosition}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>Choose your map type:</Text>
          <View style={styles.buttonView}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressAppleMap}
              style={!isOSM ? [styles.button, {backgroundColor: colors.dodgeBlue}] : styles.button}>
              <Text style={styles.text}>Apple Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressOSM}
              style={isOSM ? [styles.button, {backgroundColor: colors.dodgeBlue}] : styles.button}>
              <Text style={styles.text}>OSM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    width: '100%',
    padding: 20,
  },
  backArrowView: {
    width: responsiveWidth(40),
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(50),
    marginLeft: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  backArrow: {
    marginLeft: responsiveWidth(5),
  },
  handleView: {
    padding: 20,
    backgroundColor: colors.primaryBackground,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: '45%',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    width: responsiveWidth(45),
    aspectRatio: 1,
    borderRadius: 80,
    marginTop: responsiveHeight(-160),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginRight: responsiveWidth(20),
  },
  text: {
    fontSize: 15,
    padding: 10,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(20),
  },
  titleText: {
    fontSize: 25,
  },
})

export default React.memo(BottomSheetComponent)
