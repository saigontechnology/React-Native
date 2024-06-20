import {ParamListBase} from '@react-navigation/native'
import RouteKey from './RouteKey'

/** Type */
type HomeScreenParams = {
  userId: ''
}
type LoginScreenParams = object
type SignUpScreenParams = object
type MapViewScreenParams = object
type MenuScreenParams = object
type CreateZoneScreenParams = object
type MapRouteScreenParams = object
type LoadKmlScreenParams = object

export interface AppStackParamList extends ParamListBase {
  /** Params */
  [RouteKey.HomeScreen]: HomeScreenParams
  [RouteKey.LoginScreen]: LoginScreenParams
  [RouteKey.SignUpScreen]: SignUpScreenParams
  [RouteKey.MapViewScreen]: MapViewScreenParams
  [RouteKey.MenuScreen]: MenuScreenParams
  [RouteKey.CreateZoneScreen]: CreateZoneScreenParams
  [RouteKey.MapRouteScreen]: MapRouteScreenParams
  [RouteKey.LoadKmlScreen]: LoadKmlScreenParams
}

export type IItemTabBar = {
  route: string
  title: string
}
