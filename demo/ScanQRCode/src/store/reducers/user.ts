import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IUser, IUserInfo} from '../types'

export const userInitialState: IUser = {
  userInfo: {},
  isEndUser: false,
  tokenData: {},
  contentFlagged: '',
}

export const userSlice = createSlice({
  name: 'auth',
  initialState: userInitialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserInfo | object>) => {
      state.userInfo = action.payload
    },
    userLogin: () => {
      // TODO: add action when user login
    },
    userSignUp: () => {
      // TODO: add action when user sign up
    },
    logout: () => {
      // TODO: add action when user logout
    },
  },
})

export const userActions = {
  ...userSlice.actions,
}

export default userSlice.reducer
