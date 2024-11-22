import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {
  CreateZoneScreen,
  LoadKmlScreen,
  LoginScreen,
  MapRouteScreen,
  MapViewScreen,
  MenuScreen,
  SignUpScreen,
} from '../screens'
import HomeScreen from '../screens/HomeComponent/HomeScreen'
import RouteKey from './RouteKey'
import {optionsMatch} from './ScreenService'
import {AppStackParamList} from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

const NO_HEADER = {
  headerShown: false,
}

export const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={RouteKey.HomeScreen}
      component={HomeScreen}
      options={optionsMatch(RouteKey.HomeScreen)}
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

export const MapNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={RouteKey.MenuScreen} component={MenuScreen} options={NO_HEADER} />
    <Stack.Screen
      name={RouteKey.MapViewScreen}
      component={MapViewScreen}
      options={optionsMatch(RouteKey.MapViewScreen)}
    />
    <Stack.Screen
      name={RouteKey.CreateZoneScreen}
      component={CreateZoneScreen}
      options={optionsMatch(RouteKey.MapViewScreen)}
    />
    <Stack.Screen
      name={RouteKey.MapRouteScreen}
      component={MapRouteScreen}
      options={optionsMatch(RouteKey.MapViewScreen)}
    />
    <Stack.Screen
      name={RouteKey.LoadKmlScreen}
      component={LoadKmlScreen}
      options={optionsMatch(RouteKey.MapViewScreen)}
    />
  </Stack.Navigator>
)
