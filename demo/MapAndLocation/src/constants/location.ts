import {Dimensions} from 'react-native'

export const DEFAULT_LATITUDE_DELTA = 0.0461
const window = Dimensions.get('window')
const {width, height} = window
export const DEFAULT_LONGITUDE_DELTA = (DEFAULT_LATITUDE_DELTA * width) / height

export const DEFAULT_GET_LOCATION_INTERVAL = 5000

export const DEFAULT_SEARCH_ADDRESS_WAIT = 1500

export const DEFAULT_ZOOM_LEVEL = 14.5

export const DEFAULT_REGION = __DEV__
  ? // STS Orchard
    {
      latitude: 10.8091931,
      longitude: 106.6726221,
    }
  : // New Zealand
    {
      latitude: -41.28666552,
      longitude: 174.772996908,
    }
