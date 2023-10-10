/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useMemo, useState} from 'react'
import {SafeAreaView, StyleSheet, StatusBar, useColorScheme} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import {db, mediaConstraints, peerConstraints, Rooms, WebRTC} from './src'
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc'

export const peerConnection = new RTCPeerConnection(peerConstraints)

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      flex: 1,
    }),
    [isDarkMode],
  )
  const [roomJoinId, setRoomJoinId] = useState('')
  const [isStream, setIsStream] = useState(false)
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>()

  const handleJoinRoom = useCallback((roomId: string) => {
    setRoomJoinId(roomId)
    setIsStream(true)
  }, [])

  const handleBackRooms = useCallback(() => {
    setIsStream(false)
    setRoomJoinId('')
  }, [])

  const handleEndCall = useCallback(() => {}, [])

  const handleStartCall = useCallback(async () => {
    if (roomJoinId === '') {
      return
    }
    setRemoteStream(new MediaStream([]))
    peerConnection.addEventListener('track', (event: any) => {
      console.log('track PC', event)
      event?.streams[0].getTracks().forEach((track: any) => {
        const remote = remoteStream ?? new MediaStream([])
        remote?.addTrack(track)
        setRemoteStream(remote)
      })
    })

    const roomRef = db.collection('rooms').doc(roomJoinId)
    const offerCandidates = roomRef.collection('offerCandidates')
    const answerCandidates = roomRef.collection('answerCandidates')

    peerConnection.addEventListener('icecandidate', (event: any) => {
      console.log('icecandidate PC', event)
      event.candidate && answerCandidates.add(event.candidate.toJSON())
    })
    const roomData = (await roomRef.get()).data()
    // get offer
    const offer = roomData?.offer
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

    // create answer
    const answerDes = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answerDes)

    const answer = {
      type: answerDes.type,
      sdp: answerDes.sdp,
    }

    await roomRef.update({answer})

    // when send answered success, add candidates to peer connection
    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          peerConnection.addIceCandidate(candidate)
        }
      })
    })
  }, [])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {isStream ? (
        <WebRTC
          remoteStream={remoteStream}
          onCall={handleStartCall}
          onEndCall={handleEndCall}
          roomId={roomJoinId}
          onBack={handleBackRooms}
          style={styles.containerWebRTC}
        />
      ) : (
        <Rooms onJoinRoom={handleJoinRoom} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  containerWebRTC: {
    flex: 1,
    backgroundColor: 'rgba(50,10,3,0.5)',
  },
})

export default App
