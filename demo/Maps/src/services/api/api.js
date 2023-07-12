import {postRequest, getRequest} from '../networking/index'
import Config from 'react-native-config'

const baseURL = Config.API_URL

export const AUTH_API = {
  // ADD ENDPOINT REFRESH TOKEN HERE
  refreshToken: 'api/refreshToken',
}

export async function login(data) {
  const params = new URLSearchParams()
  params.append('client_id', data.client_id)
  params.append('client_secret', data.client_secret)
  params.append('grant_type', data.grant_type)
  params.append('scope', data.scope)
  params.append('username', data.username)
  params.append('password', data.password)
  const rs = await postRequest(`${baseURL}/token`, params.toString(), {
    'Content-Type': 'application/x-www-form-urlencoded',
  })
  return rs
}

export async function getUserProfile() {
  const rs = await getRequest(`${baseURL}/membership-service/1.2.0/users/me`)
  return rs
}
