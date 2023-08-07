import Config from 'react-native-config'
// eslint-disable-next-line import/no-cycle
import {getRequest, postRequest, putRequest} from '../networking/index'

export const AUTH_API = {
  // ADD ENDPOINT REFRESH TOKEN HERE
  refreshToken: 'api/refreshToken',
}

const baseURL = Config.API_URL

export async function changePassword(body) {
  const rs = await postRequest(`${baseURL}/Account/changepassword`, body)
  return rs
}

export async function forgotPassword(body) {
  const rs = await postRequest(`${baseURL}/Account/forgotpassword`, body)
  return rs
}

export async function resetPassword(body) {
  const rs = await postRequest(`${baseURL}/Account/resetpassword`, body)
  return rs
}

export async function getUserProfile(id) {
  const rs = await getRequest(`${baseURL}/UserProfile/${id}`)
  return rs
}

export async function updateUserProfile(id, body) {
  const rs = await putRequest(`${baseURL}/UserProfile/${id}`, body)
  return rs
}
