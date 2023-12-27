import React, {memo, useEffect, useState} from 'react'
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native'
import {mediaDevices, MediaStream, RTCView} from 'react-native-webrtc'
import {mediaConstraints} from '../constants'
import {peerConnection} from '../../App'

interface WebRTCProps {
  style?: StyleProp<ViewStyle>
  roomId: string
  onBack: () => void
  onCall: () => void
  onEndCall: () => void
  remoteStream?: MediaStream
}
export const WebRTC = memo<WebRTCProps>(({style, roomId, onBack, remoteStream, onCall, onEndCall}) => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>()
  const openMediaDevices = async () => {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints)
    setLocalStream(mediaStream)
    mediaStream.getTracks().forEach(track => peerConnection.addTrack(track, mediaStream))
  }

  useEffect(() => {
    if (remoteStream === undefined) {
      openMediaDevices()
    }
  }, [remoteStream])

  return (
    <View style={style}>
      <Text style={styles.headerText}>Room: {roomId}</Text>
      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.stream} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.stream} />}
      <View style={styles.containerButtons}>
        <TouchableOpacity onPress={onBack} style={[styles.button, styles.back]}>
          <Text style={styles.textButton}>Back Rooms</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCall} style={[styles.button, styles.startCall]}>
          <Text style={styles.textButton}>Start Call</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEndCall} style={[styles.button, styles.endCall]}>
          <Text style={styles.textButton}> End Call </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})
WebRTC.displayName = 'WebRTC'
const styles = StyleSheet.create({
  stream: {
    flex: 1,
  },
  headerText: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
    padding: 16,
  },
  back: {
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  startCall: {
    backgroundColor: 'rgba(20,150,23, 0.8)',
  },
  endCall: {
    backgroundColor: 'rgba(120,20,23, 0.8)',
  },
})
