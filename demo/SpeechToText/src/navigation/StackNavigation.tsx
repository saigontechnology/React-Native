import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {LoginScreen, SignUpScreen} from '../screens'
import HomeScreen from '../screens/HomeComponent/HomeScreen'
import RouteKey from './RouteKey'
import {optionsMatch} from './ScreenService'
import {AppStackParamList} from './types'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import SpeechToTxt from '../screens/SpeechToText'
import TextToSpeech from '../screens/TextToSpeech'

const Stack = createNativeStackNavigator<AppStackParamList>()

const Tab = createBottomTabNavigator()

export const HomeNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name={RouteKey.SpeechToText} component={SpeechToTxt} />
    <Tab.Screen name={RouteKey.TextToSpeech} component={TextToSpeech} />
  </Tab.Navigator>
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
