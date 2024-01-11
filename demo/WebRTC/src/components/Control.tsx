import React from 'react'
import {View, StyleSheet, StyleProp, ViewStyle, Image, Pressable} from 'react-native'
import {Images, colors, metrics} from '../themes'
import {MediaControl} from '../screens/HomeComponent/types'

interface IControlProps {
  containerStyle?: StyleProp<ViewStyle>
  mediaControl?: MediaControl
  toggleMicrophone?: () => void
  toggleCamera?: () => void
  hangUp?: () => void
  iconSize?: number
  showMuteAudio?: boolean
  muteAudioColor?: string
}

export const Control = ({
  containerStyle,
  mediaControl,
  toggleMicrophone,
  toggleCamera,
  iconSize = metrics.large,
  hangUp,
  showMuteAudio = false,
  muteAudioColor,
}: IControlProps) => (
  <View style={[styles.controlContainer, containerStyle]}>
    {showMuteAudio ? (
      <Image
        source={Images.micMuteFill}
        resizeMode="contain"
        style={{
          width: iconSize,
          height: iconSize,
          tintColor: muteAudioColor,
        }}
      />
    ) : (
      <>
        <Pressable
          style={[
            styles.button,
            mediaControl?.mic && styles.active,
            {
              borderRadius: iconSize * 2,
            },
          ]}
          onPress={toggleMicrophone}>
          <Image
            source={mediaControl?.mic ? Images.mic : Images.micMute}
            resizeMode="contain"
            style={{
              width: iconSize,
              height: iconSize,
              tintColor: mediaControl?.mic || !hangUp ? colors.dark : colors.white,
            }}
          />
        </Pressable>
        <Pressable
          style={[
            styles.button,
            mediaControl?.camera && styles.active,
            {
              borderRadius: iconSize * 2,
            },
          ]}
          onPress={toggleCamera}>
          <Image
            source={mediaControl?.camera ? Images.camera : Images.cameraOff}
            resizeMode="contain"
            style={{
              width: iconSize,
              height: iconSize,
              tintColor: mediaControl?.camera || !hangUp ? colors.dark : colors.white,
            }}
          />
        </Pressable>
        {!!hangUp && (
          <Pressable
            style={[
              styles.button,
              styles.hangUp,
              {
                borderRadius: iconSize * 2,
              },
            ]}
            onPress={hangUp}>
            <Image
              source={Images.hangUp}
              resizeMode="contain"
              style={{
                width: iconSize,
                height: iconSize,
                tintColor: colors.white,
              }}
            />
          </Pressable>
        )}
      </>
    )}
  </View>
)

const styles = StyleSheet.create({
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: metrics.small,
  },
  button: {
    padding: metrics.xs,
  },
  active: {
    backgroundColor: colors.white,
  },
  hangUp: {
    backgroundColor: colors.red,
  },
})
