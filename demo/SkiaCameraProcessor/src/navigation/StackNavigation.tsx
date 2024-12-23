import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {
  AtlasAnimateScreen,
  CameraFaceNormalScreen,
  CameraFaceNormalSkiaScreen,
  CameraFaceSkiaScreen,
  ClipImageScreen,
  LoginScreen,
  PaintScreen,
  ShaderScreen,
  ShapeScreen,
  SignUpScreen,
  TextScreen,
} from '../screens'
import HomeScreen from '../screens/HomeComponent/HomeScreen'
import RouteKey from './RouteKey'
import {optionsMatch} from './ScreenService'
import {AppStackParamList} from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={RouteKey.HomeScreen}
      component={HomeScreen}
      options={optionsMatch(RouteKey.HomeScreen)}
    />
    <Stack.Screen name={RouteKey.PaintScreen} component={PaintScreen} />
    <Stack.Screen name={RouteKey.ClipImageScreen} component={ClipImageScreen} />
    <Stack.Screen name={RouteKey.ShapeScreen} component={ShapeScreen} />
    <Stack.Screen name={RouteKey.AtlasAnimateScreen} component={AtlasAnimateScreen} />
    <Stack.Screen name={RouteKey.TextScreen} component={TextScreen} />
    <Stack.Screen name={RouteKey.ShaderScreen} component={ShaderScreen} />

    <Stack.Screen name={RouteKey.CameraFaceSkiaScreen} component={CameraFaceSkiaScreen} />
    <Stack.Screen name={RouteKey.CameraFaceNormalScreen} component={CameraFaceNormalScreen} />
    <Stack.Screen name={RouteKey.CameraFaceNormalSkiaScreen} component={CameraFaceNormalSkiaScreen} />
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
