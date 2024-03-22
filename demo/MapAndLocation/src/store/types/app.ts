import {IActionDispatch} from './action'

export interface IApp {
  showGlobalIndicator?: boolean
  appState: string
  showSearchBar?: boolean
  codePushKey?: string
  apiUrl?: string
  location: LocationData | null
}

export type LocationData = {
  latitude: number
  longitude: number
}

export interface IAppActions {
  getSettings: IActionDispatch
  setAppStack: IActionDispatch
  getSettingsSuccess: IActionDispatch
  setShowGlobalIndicator: IActionDispatch
  setCodePushKey: IActionDispatch
  setApiUrl: IActionDispatch
}
