import {ParamListBase} from '@react-navigation/native'
import RouteKey from './RouteKey'

/** Type */
type HomeScreenParams = {
  userId: ''
}
type LoginScreenParams = object
type SignUpScreenParams = object
type PrepareCallingScreenParams = object
type CallingScreenParams = {
  url: string
  key: string
}

export interface AppStackParamList extends ParamListBase {
  /** Params */
  [RouteKey.HomeScreen]: HomeScreenParams
  [RouteKey.LoginScreen]: LoginScreenParams
  [RouteKey.SignUpScreen]: SignUpScreenParams
  [RouteKey.PrepareCallingScreen]: PrepareCallingScreenParams
  [RouteKey.CallingScreen]: CallingScreenParams
}

export type IItemTabBar = {
  route: string
  title: string
}
