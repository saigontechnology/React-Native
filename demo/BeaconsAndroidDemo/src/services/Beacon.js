/**
 * Created by NL on 8/10/23.
 */
import {Component} from 'react'
import {DeviceEventEmitter} from 'react-native'
import Beacons from 'react-native-beacons-manager'

const TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss'

export default class BeaconDetection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // region information
      uuid: '7c3e676f-278b-4f86-b894-5c127dbf8580',
      identifier: 'baobao',
      major: 0,
      minor: 0,
      foundBeacon: false,
    }
  }

  componentWillMount() {
    Beacons.detectIBeacons()
  }

  componentWillUnMount() {
    console.log('UNMOUNT  BEGIN XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    const {uuid, identifier} = this.state
    const region = {identifier, uuid}

    // stop ranging beacons:
    Beacons.stopRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons ranging stopped succesfully'))
      .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`))

    // stop monitoring beacons:
    Beacons.stopMonitoringForRegion(region)
      .then(() => console.log('Beacons monitoring stopped succesfully'))
      .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`))

    // remove ranging event we registered at componentDidMount
    DeviceEventEmitter.removeListener('beaconsDidRange')
    // remove beacons events we registered at componentDidMount
    DeviceEventEmitter.removeListener('regionDidEnter')
    DeviceEventEmitter.removeListener('regionDidExit')

    console.log('UNMOUNT  END XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
  }

  render() {
    return this.startDetection()
  }

  startDetection() {
    const {foundBeacon} = this.state

    if (foundBeacon) {
      this.startMonitoringBeacon()
    } else {
      this.startRanging()
    }

    return null
  }

  startMonitoringBeacon() {
    const regionToMonitor = ({identifier, uuid, major, minor} = this.state)

    this.doAction(identifier, uuid, minor, major, new Date().valueOf())

    Beacons.startMonitoringForRegion(regionToMonitor)
      .then(() => console.log('Beacons monitoring started succesfully'))
      .catch(error => console.log(`Beacons monitoring not started, error: ${error}`))

    DeviceEventEmitter.addListener('regionDidExit', ({identifier, uuid, minor, major}) => {
      Beacons.stopMonitoringForRegion(regionToMonitor)
        .then(() => console.log('Beacons monitoring stopped succesfully'))
        .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`))
      DeviceEventEmitter.removeListener('regionDidExit')
      console.log('monitoring - regionDidExit data: ', {
        identifier,
        uuid,
        minor,
        major,
        time: new Date().valueOf(),
      })
      this.setState({foundBeacon: false})
    })
  }

  startRanging() {
    const {identifier, uuid} = this.state

    // Range beacons inside the region
    Beacons.startRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons ranging started succesfully'))
      .catch(error => console.log(`Beacons ranging not started, error: ${error}`))

    // Ranging:
    DeviceEventEmitter.addListener('beaconsDidRange', data => {
      console.log('beaconsDidRange data: ', data)
      if (data.beacons.length > 0) {
        Beacons.stopRangingBeaconsInRegion(identifier, uuid)
          .then(() => console.log('Beacons ranging stopped succesfully'))
          .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`))
        DeviceEventEmitter.removeListener('beaconsDidRange')
        var beacon = this.nearestBeacon(data.beacons)
        console.log('Selected beacon: ', beacon)
        this.setState({major: beacon.major, minor: beacon.minor, foundBeacon: true})
      }
    })
  }

  doAction(identifier, uuid, minor, major, time) {
    console.log('AWESOME stuff--------------------------')
    console.log({identifier, uuid, minor, major, time})
    console.log('AWESOME stuff--------------------------')
  }

  nearestBeacon(beacons) {
    console.log('beacons', beacons)
    var i
    var minDistIndex = 0
    var minDist = Number.MAX_VALUE
    for (i = 0; i < beacons.length; i++) {
      if (beacons[i].distance < minDist) {
        minDist = beacons[i].distance
        minDistIndex = i
      }
    }
    return beacons[minDistIndex]
  }
}
