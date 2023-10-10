import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc'
import {db, mediaConstraints, peerConstraints} from './src'
import React, {useState} from 'react'
import {Button, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'

const pc = new RTCPeerConnection(peerConstraints)

const MobileWebRTC: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>()
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>()
  const [textInput, setTextInput] = useState<string>('')
  const [statusButtons, setStatusButtons] = useState({
    roomId: '',
    hangUpBtn: true,
    isCreateRoom: true,
    createRoomBtn: true,
    joinRoomBtn: true,
    openMediaDevicesBtn: false,
    isModalVisible: false,
  })
  const openJoinRoomModal = () => {
    setStatusButtons(prev => ({
      ...prev,
      isModalVisible: true,
    }))
  }
  const openMediaDevices = async () => {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints)

    setLocalStream(mediaStream)
    setRemoteStream(new MediaStream([]))
    mediaStream.getTracks().forEach(track => pc.addTrack(track, mediaStream))

    pc.addEventListener('track', event => {
      console.log('track PC', event)
      event?.streams[0].getTracks().forEach((track: any) => {
        const remote = remoteStream ?? new MediaStream([])
        remote?.addTrack(track)
        setRemoteStream(remote)
      })
    })

    setStatusButtons(prev => ({
      ...prev,
      joinRoomBtn: false,
      createRoomBtn: false,
      openMediaDevicesBtn: true,
      hangUpBtn: true,
    }))
  }

  const createRoom = async () => {
    const roomRef = db.collection('rooms').doc()
    const offerCandidates = roomRef.collection('offerCandidates')
    const answerCandidates = roomRef.collection('answerCandidates')

    setStatusButtons(prev => ({
      ...prev,
      roomId: roomRef.id,
      joinRoomBtn: true,
      createRoomBtn: true,
      openMediaDevicesBtn: true,
      hangUpBtn: false,
    }))

    // set condition for hanging up call

    //get candidates for caller
    pc.addEventListener('icecandidate', event => {
      console.log('icecandidate PC', event)
      event.candidate && offerCandidates.add(event.candidate.toJSON())
    })

    //create offer
    const offerDes = await pc.createOffer({
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    })
    await pc.setLocalDescription(offerDes)

    const offer = {
      type: offerDes.type,
      sdp: offerDes.sdp,
    }

    await roomRef.set({offer})
    await roomRef.update({isHangUp: false})

    // listen for remote answer
    roomRef.onSnapshot(snapshot => {
      const data = snapshot.data()
      if (!pc.remoteDescription && data?.answer) {
        const answer = new RTCSessionDescription(data.answer)
        pc.setRemoteDescription(answer)
      }
    })

    // when answered, add candidates to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.addIceCandidate(candidate)
        }
      })
    })
  }
  const joiningRoom = async (
    roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  ) => {
    const offerCandidates = roomRef.collection('offerCandidates')
    const answerCandidates = roomRef.collection('answerCandidates')
    console.log('🚀 -> App -> joinRoomById= -> roomSnapshot', roomRef)

    pc.addEventListener('icecandidate', event => {
      console.log('icecandidate PC', event)
      event.candidate && answerCandidates.add(event.candidate.toJSON())
    })

    const roomData = (await roomRef.get()).data()

    // get offer
    const offer = roomData?.offer
    await pc.setRemoteDescription(new RTCSessionDescription(offer))

    // create answer
    const answerDes = await pc.createAnswer()
    await pc.setLocalDescription(answerDes)

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
          pc.addIceCandidate(candidate)
        }
      })
    })
  }

  const joinRoomById = async (joinRoomId: string) => {
    setStatusButtons(prev => ({
      ...prev,
      isModalVisible: false,
      joinRoomBtn: true,
      createRoomBtn: true,
      openMediaDevicesBtn: true,
      hangUpBtn: false,
      isCreateRoom: false,
    }))

    const roomRef = db.collection('rooms').doc(joinRoomId)

    roomRef.get().then(docSnapshot => {
      console.log(docSnapshot)
      if (!docSnapshot.exists) {
        setStatusButtons(prev => ({
          ...prev,
          joinRoomBtn: false,
          createRoomBtn: false,
          openMediaDevicesBtn: true,
          hangUpBtn: true,
          isCreateRoom: true,
        }))
        console.warn('Room not found')
        return
      } else {
        joiningRoom(roomRef)
      }
    })
  }

  const handleCancel = () => {
    setStatusButtons(prev => ({
      ...prev,
      isModalVisible: false,
      joinRoomBtn: false,
      createRoomBtn: false,
      openMediaDevicesBtn: true,
      hangUpBtn: true,
    }))
    setTextInput('')
  }

  const hangUp = async () => {
    const roomId = statusButtons.roomId.length > 0 ? statusButtons.roomId : undefined

    // Delete room on hangup
    if (roomId) {
      const roomRef = db.collection('rooms').doc(roomId)
      const answerCandidates = await roomRef.collection('answerCandidates').get()
      const offerCandidates = await roomRef.collection('offerCandidates').get()
      const batch = db.batch()
      answerCandidates.forEach(doc => {
        batch.delete(doc.ref)
      })
      offerCandidates.forEach(doc => {
        batch.delete(doc.ref)
      })
      await roomRef.update({isHangUp: true})

      //listen hanging up
      roomRef.onSnapshot(snapshot => {
        const data = snapshot.data()
        console.log(data?.isHangUp)
        if (data?.isHangUp) {
          const tracks = localStream?.getTracks()
          tracks?.forEach(track => {
            track.stop()
          })

          if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop())
          }

          if (pc) {
            pc.close()
          }

          setLocalStream(undefined)
          setRemoteStream(undefined)
          console.log('hang up')
        }
      })

      await batch.commit()
      await roomRef.delete()
    }

    setStatusButtons(prev => ({
      ...prev,
      openMediaDevicesBtn: false,
      joinRoomBtn: true,
      hangupBtn: true,
      createRoomBtn: true,
      roomId: '',
    }))
  }
  const onChangeRoomId = (roomId: string) => {
    console.log(roomId)
    setStatusButtons(prev => ({...prev, isModalVisible: false}))
    setTextInput('')
    joinRoomById(roomId)
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
        <View style={styles.header}>
          <Text style={{color: 'black'}}>{`Room ID: ${statusButtons.roomId}\n ${JSON.stringify(
            statusButtons,
          )}`}</Text>
        </View>
        {localStream && <RTCView streamURL={localStream.toURL()} style={styles.stream} />}
        {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          {statusButtons.isModalVisible && (
            <View>
              <TextInput
                style={{
                  color: 'black',
                }}
                onChangeText={setTextInput}
                value={textInput}
              />
              <Button onPress={handleCancel} title={'Cancel'} />
              <Button onPress={() => onChangeRoomId(textInput)} title={'Join room'} />
            </View>
          )}
          <Button
            onPress={async () => {
              await openMediaDevices()
            }}
            disabled={statusButtons.openMediaDevicesBtn}
            title={'Open camera and audio'}
          />
          <Button
            onPress={async () => {
              await createRoom()
            }}
            disabled={statusButtons.createRoomBtn}
            title={'Create Room'}
          />
          <Button onPress={openJoinRoomModal} disabled={statusButtons.joinRoomBtn} title={'Join room'} />
          <Button onPress={hangUp} disabled={statusButtons.hangUpBtn} title={'Hang up'} />
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 1,
  },
  footer: {
    backgroundColor: Colors.lighter,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    backgroundColor: Colors.lighter,
    top: 0,
    left: 0,
    right: 0,
  },
})

export default MobileWebRTC
