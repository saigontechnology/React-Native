import React, {useMemo} from 'react'
import {StyleSheet, Dimensions, View} from 'react-native'
import {colors, metrics} from '../themes'
import {MediaControl} from '../screens/HomeComponent/types'
import {Draggable} from './Draggable'
import {MediaStream, RTCView} from 'react-native-webrtc'
import {Control} from './Control'
import {Avatar} from './Avatar'

interface IDraggableStreamProps {
  stream?: MediaStream
  mediaControl: MediaControl
  title: string
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen')

export const DraggableStream = ({stream, mediaControl, title}: IDraggableStreamProps) => {
  const dimensions = useMemo(
    () => ({
      width: screenWidth / 3,
      height: screenHeight / 4,
    }),
    [],
  )

  return (
    <Draggable
      animatedViewProps={dimensions}
      x={screenWidth - (metrics.small + dimensions.width)}
      y={screenHeight - (metrics.massive + metrics.huge + dimensions.height)}>
      <View style={dimensions}>
        {!!stream && mediaControl.camera ? (
          <>
            <RTCView streamURL={stream.toURL()} style={styles.cameraOn} objectFit="cover" />
            {!mediaControl.mic && (
              <Control showMuteAudio muteAudioColor={colors.white} containerStyle={styles.controlContainer} />
            )}
          </>
        ) : (
          <View style={styles.cameraOff}>
            <Avatar title={title} size={metrics.massive} />
            {!mediaControl.mic && <Control showMuteAudio containerStyle={styles.controlContainer} />}
          </View>
        )}
      </View>
    </Draggable>
  )
}

const styles = StyleSheet.create({
  cameraOff: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadiusLarge,
  },
  cameraOn: {
    flex: 1,
    borderRadius: metrics.borderRadiusLarge,
  },
  controlContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: metrics.large,
  },
})
