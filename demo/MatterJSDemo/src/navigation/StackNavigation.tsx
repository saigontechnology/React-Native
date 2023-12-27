import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {LoginScreen, SignUpScreen, GameOverScreen, HomeScreen, GamePlayScreen} from '../screens'
import RouteKey from './RouteKey'
import {optionsMatch} from './ScreenService'
import {AppStackParamList} from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export const HomeNavigator = () => (
  <Stack.Navigator initialRouteName={RouteKey.HomeScreen}>
    <Stack.Screen
      name={RouteKey.HomeScreen}
      component={HomeScreen}
      options={optionsMatch(RouteKey.HomeScreen)}
    />
    <Stack.Screen
      name={RouteKey.GamePlayScreen}
      component={GamePlayScreen}
      options={optionsMatch(RouteKey.GamePlayScreen)}
    />
    <Stack.Screen
      name={RouteKey.GameOverScreen}
      component={GameOverScreen}
      options={optionsMatch(RouteKey.GameOverScreen)}
    />
  </Stack.Navigator>
)

export const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={RouteKey.LoginScreen}
      component={LoginScreen}
      options={optionsMatch(RouteKey.LoginScreen)}
    />
    <Stack.Screen
      name={RouteKey.SignUpScreen}
      component={SignUpScreen}
      options={optionsMatch(RouteKey.SignUpScreen)}
    />
  </Stack.Navigator>
)
