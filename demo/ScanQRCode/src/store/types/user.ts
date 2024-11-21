import {ActionCreatorWithoutPayload} from '@reduxjs/toolkit'
import {IActionDispatch} from './action'

export interface IUserInfo {
  email: string;
  uid: string;
  displayName: string;
}

export interface ITokenData {}

export interface IUser {
  userInfo: IUserInfo | object
  isEndUser?: boolean
  tokenData?: ITokenData
  contentFlagged?: string
}

export interface IUserActions {
  userLogin: IActionDispatch
  userSignUp: IActionDispatch
  logout: ActionCreatorWithoutPayload
}
