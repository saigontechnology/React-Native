import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import RouteKey from './RouteKey'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import {responsiveHeight, responsiveWidth} from '../themes/metrics'
import {colors} from '../themes/colors'

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const colorPressed = isFocused ? colors.lightBlue : colors.darkGray

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true})
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        const renderIcon = () => {
          switch (route.name) {
            case RouteKey.HomeScreen:
              return <Octicons name="home" size={25} color={colorPressed} />
            case RouteKey.CoinScreen:
              return (
                <View style={[styles.circle, {borderColor: colorPressed}]}>
                  <Fontisto name="dollar" size={15} color={colorPressed} />
                </View>
              )
            case RouteKey.JobScreen:
              return (
                <View>
                  <Ionicons name="car" size={30} color={colorPressed} />
                  <NotificationCount />
                </View>
              )

            case RouteKey.MenuScreen:
              return <Feather name="menu" size={25} color={colorPressed} />
            default:
              return <></>
          }
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.iconSection}>
            <View style={styles.icon}>{renderIcon()}</View>
            <Text style={[styles.text, {color: colorPressed}]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function NotificationCount({count}) {
  return (
    <View style={styles.countBorderContainer}>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  )
}

export default MyTabBar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    height: responsiveHeight(90),
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
    marginTop: responsiveHeight(12),
    height: '100%',
  },
  circle: {
    borderWidth: 1,
    borderRadius: 60,
    width: responsiveWidth(22),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: responsiveHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBorderContainer: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(16) / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(4),
  },
})
