import {createSlice} from '@reduxjs/toolkit'
import {USER_CONSTANTS_ACTIONS} from '../constants/user'

export const userInitialState = {
  userInfo: {},
  isEndUser: false,
  tokenData: {},
  contentFlagged: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    userLogin: () => {},
    userSignUp: () => {},
    logout(state) {},
    [USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.HANDLER]: () => {},
    [USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.SUCCESS]: () => {},
    [USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.FAILURE]: () => {},
    [USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.HANDLER]: () => {},
    [USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.SUCCESS]: () => {},
    [USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.FAILURE]: () => {},
    [USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.HANDLER]: () => {},
    [USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.SUCCESS]: () => {},
    [USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.FAILURE]: () => {},
    [USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.HANDLER]: () => {},
    [USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.SUCCESS]: (state, action) => {
      state.userInfo = action.data
    },
    [USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.FAILURE]: () => {},
    [USER_CONSTANTS_ACTIONS.UPDATE_USER_INFO_ACTIONS.HANDLER]: () => {},
    [USER_CONSTANTS_ACTIONS.UPDATE_USER_INFO_ACTIONS.FAILURE]: () => {},
  },
  extraReducers: builder => {},
})

export const userActions = {
  ...userSlice.actions,
  userLoginHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.USER_LOGIN_ACTIONS.HANDLER],
  userLoginSuccess: userSlice.actions[USER_CONSTANTS_ACTIONS.USER_LOGIN_ACTIONS.SUCCESS],
  userLoginFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.USER_LOGIN_ACTIONS.FAILURE],
  changePasswordHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.HANDLER],
  changePasswordSuccess: userSlice.actions[USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.SUCCESS],
  changePasswordFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.CHANGE_PASSWORD_ACTIONS.FAILURE],
  forgotPasswordHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.HANDLER],
  forgotPasswordSuccess: userSlice.actions[USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.SUCCESS],
  forgotPasswordFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.FORGOT_PASSWORD_ACTIONS.FAILURE],
  resetPasswordHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.HANDLER],
  resetPasswordSuccess: userSlice.actions[USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.SUCCESS],
  resetPasswordFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.RESET_PASSWORD_ACTIONS.FAILURE],
  getUserProfileHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.HANDLER],
  getUserProfileSuccess: userSlice.actions[USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.SUCCESS],
  getUserProfileFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.GET_USER_PROFILE_ACTIONS.FAILURE],
  updateUserProfileHandle: userSlice.actions[USER_CONSTANTS_ACTIONS.UPDATE_USER_INFO_ACTIONS.HANDLER],
  updateUserProfileFailure: userSlice.actions[USER_CONSTANTS_ACTIONS.UPDATE_USER_INFO_ACTIONS.FAILURE],
}

export default userSlice.reducer
