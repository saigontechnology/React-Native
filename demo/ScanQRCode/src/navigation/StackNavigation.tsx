import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {CameraScreen, HomeScreen, LoginScreen, RecordScreen, SignUpScreen} from '../screens'
import RouteKey from './RouteKey'
import {optionsMatch} from './ScreenService'
import {AppStackParamList} from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen
      name={RouteKey.HomeScreen}
      component={HomeScreen}
      options={optionsMatch(RouteKey.HomeScreen)}
    />
    <Stack.Screen
      name={RouteKey.CameraScreen}
      component={CameraScreen}
      options={optionsMatch(RouteKey.CameraScreen)}
    />
    <Stack.Screen
      name={RouteKey.RecordScreen}
      component={RecordScreen}
      options={optionsMatch(RouteKey.RecordScreen)}
    />
  </Stack.Navigator>
)

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
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
