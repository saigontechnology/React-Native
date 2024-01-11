import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {PropsWithChildren} from 'react'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {MediaStream} from 'react-native-webrtc'

export type Props = NativeStackScreenProps<AppStackParamList, RouteKey.HomeScreen> & PropsWithChildren

export enum Screen {
  CreateRoom,
  InRoomCall,
}

export type RemoteSteam = {
  track: MediaStream
  mic: boolean
  camera: boolean
  id: string
}

export type MediaControl = {
  mic: boolean
  camera: boolean
  speaker?: boolean
}
