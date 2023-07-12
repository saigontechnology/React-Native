import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {screenMatch, optionsMatch} from './ScreenService'
import RouteKey from './RouteKey'
import MyTabBar from './CustomTabBar'
import {HomeNavigator} from './StackNavigation'

const Tab = createBottomTabNavigator()

function MainTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name={RouteKey.HomeScreen}
        component={screenMatch(RouteKey.HomeScreen)}
        options={optionsMatch(RouteKey.HomeScreen)}
      />
      <Tab.Screen
        name={RouteKey.CoinScreen}
        component={screenMatch(RouteKey.LoginScreen)}
        options={optionsMatch(RouteKey.LoginScreen)}
      />
      <Tab.Screen
        name={RouteKey.JobScreen}
        component={HomeNavigator}
        options={optionsMatch(RouteKey.JobScreen)}
      />
      <Tab.Screen
        name={RouteKey.MenuScreen}
        component={screenMatch(RouteKey.LoginScreen)}
        options={optionsMatch(RouteKey.LoginScreen)}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigation
