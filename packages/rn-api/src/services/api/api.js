import Config from 'react-native-config'
// eslint-disable-next-line import/no-cycle
import {postRequest} from '../networking/index'
import {PasswordModel} from '../../models'

export const AUTH_API = {
  // ADD ENDPOINT REFRESH TOKEN HERE
  refreshToken: 'api/refreshToken',
}

const baseURL = Config.API_URL

export async function changePassword(body) {
  const rs = await postRequest(`${baseURL}/Account/changepassword`, body)
  return PasswordModel.parseFromJson(rs)
}

export async function forgotPassword(body) {
  const rs = await postRequest(`${baseURL}/Account/forgotpassword`, body)
  return PasswordModel.parseFromJson(rs)
}

export async function resetPassword(body) {
  const rs = await postRequest(`${baseURL}/Account/resetpassword`, body)
  return PasswordModel.parseFromJson(rs)
}
