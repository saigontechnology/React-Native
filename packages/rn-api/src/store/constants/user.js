import {actionTypes} from '../actionTypes'

const USER_LOGIN_ACTIONS = actionTypes('USER_LOGIN_ACTIONS')

const UPDATE_USER_INFO_ACTIONS = actionTypes('UPDATE_USER_INFO_ACTIONS')

const CHANGE_PASSWORD_ACTIONS = actionTypes('CHANGE_PASSWORD_ACTIONS')

const FORGOT_PASSWORD_ACTIONS = actionTypes('FORGOT_PASSWORD_ACTIONS')

const RESET_PASSWORD_ACTIONS = actionTypes('RESET_PASSWORD_ACTIONS')

const GET_USER_PROFILE_ACTIONS = actionTypes('GET_USER_PROFILE_ACTIONS')

export const USER_CONSTANTS_ACTIONS = {
  USER_LOGIN_ACTIONS,
  UPDATE_USER_INFO_ACTIONS,
  CHANGE_PASSWORD_ACTIONS,
  FORGOT_PASSWORD_ACTIONS,
  RESET_PASSWORD_ACTIONS,
  GET_USER_PROFILE_ACTIONS,
}
