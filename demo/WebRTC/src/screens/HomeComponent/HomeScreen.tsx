import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Avatar, Clipboard, Control, DraggableStream} from '../../components'
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native'
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc'
import {FirestoreCollections, peerConstraints, sessionConstraints} from '../../constants'
import firestore, {FirebaseFirestoreTypes, firebase} from '@react-native-firebase/firestore'
import {styles} from './styles'
import {MediaControl, Props, Screen} from './types'
import {colors, isIOS, metrics} from '../../themes'
import {usePermission, useStateRef} from '../../hooks'

const {width, height} = Dimensions.get('screen')
const database = firestore()

export const HomeScreen: React.FC<Props> = () => {
  const [roomId, setRoomId] = useState('')
  const [localStream, setLocalStream] = useState<MediaStream | undefined>()
  const [userName, setUserName] = useState('')
  const [screen, setScreen] = useState(Screen.CreateRoom)
  const [remoteMedias, setRemoteMedias, remoteMediasRef] = useStateRef<{[key: string]: MediaControl}>({})
  const [remoteStreams, setRemoteStreams, remoteStreamsRef] = useStateRef<{[key: string]: MediaStream}>({})
  const [peerConnections, setPeerConnections] = useStateRef<{
    [key: string]: RTCPeerConnection
  }>({})
  const [totalParticipants, setTotalParticipants] = useState(0)

  const {
    cameraPermissionGranted,
    microphonePermissionGranted,
    requestMicrophonePermission,
    requestCameraPermission,
  } = usePermission()
  const [localMediaControl, setLocalMediaControl] = useState<MediaControl>({
    mic: microphonePermissionGranted,
    camera: cameraPermissionGranted,
  })

  const createUser = useCallback(async () => {
    const userRef = database.collection(FirestoreCollections.users).doc()
    await userRef.set({
      name: userName,
    })
    return userName
  }, [userName])

  const listenPeerConnections = useCallback(
    async (
      roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
      createdUserName: string,
    ) => {
      roomRef.collection(FirestoreCollections.connections).onSnapshot(connectionSnapshot => {
        connectionSnapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            const data = change.doc.data()
            if (data.responder === createdUserName) {
              const requestParticipantRef = roomRef
                .collection(FirestoreCollections.participants)
                .doc(data.requester)
              const requestParticipantData = (await requestParticipantRef.get()).data()
              setRemoteMedias(prev => ({
                ...prev,
                [data.requester]: {
                  mic: requestParticipantData?.mic,
                  camera: requestParticipantData?.camera,
                },
              }))
              setRemoteStreams(prev => ({
                ...prev,
                [data.requester]: new MediaStream([]),
              }))

              /** create answer */
              const peerConnection = new RTCPeerConnection(peerConstraints)
              const connectionsCollection = roomRef.collection(FirestoreCollections.connections)
              const connectionRef = connectionsCollection.doc(`${data.requester}-${createdUserName}`)
              const answerCandidatesCollection = connectionRef.collection(
                FirestoreCollections.answerCandidates,
              )

              localStream?.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream)
              })

              peerConnection.addEventListener('track', event => {
                event.streams[0].getTracks().forEach(track => {
                  const remoteStream = remoteStreams[data.requester] ?? new MediaStream([])
                  remoteStream.addTrack(track)
                  setRemoteStreams(prev => ({
                    ...prev,
                    [data.requester]: remoteStream,
                  }))
                })
              })

              // collect ICE candidates to add in collection
              peerConnection.addEventListener('icecandidate', event => {
                if (event.candidate) {
                  answerCandidatesCollection.add(event.candidate.toJSON())
                }
              })

              // collect offer & create answer
              const connectionData = (await connectionRef.get()).data()
              const offer = connectionData?.offer
              await peerConnection.setRemoteDescription(offer)
              const answerDescription = await peerConnection.createAnswer()
              await peerConnection.setLocalDescription(answerDescription)
              const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
              }
              await connectionRef.update({answer})

              // listen for remote ICE candidates
              connectionRef
                .collection(FirestoreCollections.offerCandidates)
                .onSnapshot(iceCandidateSnapshot => {
                  iceCandidateSnapshot.docChanges().forEach(async iceCandidateChange => {
                    if (iceCandidateChange.type === 'added') {
                      await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateChange.doc.data()))
                    }
                  })
                })

              setPeerConnections(prev => ({
                ...prev,
                [data.requester]: peerConnection,
              }))
            }
          }
        })
      })
    },
    [localStream, remoteStreams, setPeerConnections, setRemoteMedias, setRemoteStreams],
  )

  const registerPeerConnection = useCallback(
    async (
      roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
      createdUserName: string,
    ) => {
      const participants = await roomRef.collection(FirestoreCollections.participants).get()
      participants.forEach(async participantSnapshot => {
        const participant = participantSnapshot.data()

        setRemoteMedias(prev => ({
          ...prev,
          [participant.name]: {
            mic: participant?.mic,
            camera: participant?.camera,
          },
        }))
        setRemoteStreams(prev => ({
          ...prev,
          [participant.name]: new MediaStream([]),
        }))

        // create ICECandidate for store answer and offer between 2 participants
        const connectionsCollection = roomRef.collection(FirestoreCollections.connections)
        const connectionRef = connectionsCollection.doc(`${createdUserName}-${participant.name}`)

        /** create offer */
        const peerConnection = new RTCPeerConnection(peerConstraints)

        // add local stream to peer connection of every participant
        localStream?.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream)
        })

        peerConnection.addEventListener('track', event => {
          event.streams[0].getTracks().forEach(track => {
            const remoteStream = remoteStreams[participant.name] ?? new MediaStream([])
            remoteStream.addTrack(track)
            setRemoteStreams(prev => ({
              ...prev,
              [participant.name]: remoteStream,
            }))
          })
        })

        // Listen for local ICE candidates on the local RTCPeerConnection
        const offerCandidatesCollection = connectionRef.collection(FirestoreCollections.offerCandidates)
        peerConnection.addEventListener('icecandidate', event => {
          if (event.candidate) {
            offerCandidatesCollection.add(event.candidate.toJSON())
          }
        })

        // create offer and set local description
        const offerDescription = await peerConnection.createOffer(sessionConstraints)
        peerConnection.setLocalDescription(offerDescription)
        const offer = {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        }
        await connectionRef.set({
          offer,
          requester: createdUserName,
          responder: participant.name,
        })

        /** listen to answer */

        // set answer as remote description
        connectionRef.onSnapshot(async connectionSnapshot => {
          const data = connectionSnapshot.data()
          if (!peerConnection.remoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer)
            await peerConnection.setRemoteDescription(answerDescription)
          }
        })

        // listen for remote ICE candidates
        connectionRef.collection(FirestoreCollections.answerCandidates).onSnapshot(iceCandidatesSnapshot => {
          iceCandidatesSnapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
              await peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()))
            }
          })
        })
        setPeerConnections(prev => ({
          ...prev,
          [participant.name]: peerConnection,
        }))
      })
    },
    [localStream, remoteStreams, setPeerConnections, setRemoteMedias, setRemoteStreams],
  )

  const createRoom = useCallback(async () => {
    const createdUserName = await createUser()
    const roomRef = database.collection(FirestoreCollections.rooms).doc(createdUserName)
    await roomRef.set({createdDate: new Date()})
    roomRef.collection(FirestoreCollections.participants).doc(createdUserName).set({
      mic: localMediaControl?.mic,
      camera: localMediaControl?.camera,
      name: createdUserName,
    })
    setRoomId(roomRef.id)
    setScreen(Screen.InRoomCall)
    await listenPeerConnections(roomRef, createdUserName)
  }, [createUser, listenPeerConnections, localMediaControl?.camera, localMediaControl?.mic])

  const joinRoom = useCallback(
    async (roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>) => {
      const createdUserName = await createUser()
      await registerPeerConnection(roomRef, createdUserName)
      await roomRef.collection(FirestoreCollections.participants).doc(createdUserName).set({
        mic: localMediaControl?.mic,
        camera: localMediaControl?.camera,
        name: createdUserName,
      })
      await listenPeerConnections(roomRef, createdUserName)
      setScreen(Screen.InRoomCall)
    },
    [
      createUser,
      registerPeerConnection,
      localMediaControl?.mic,
      localMediaControl?.camera,
      listenPeerConnections,
    ],
  )

  const checkRoomExist = useCallback(() => {
    const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

    roomRef.get().then(docSnapshot => {
      if (!docSnapshot.exists) {
        Alert.alert('Room not found')
        setRoomId('')
        return
      } else {
        joinRoom(roomRef)
      }
    })
  }, [joinRoom, roomId])

  const openMediaDevices = useCallback(async (audio: boolean, video: boolean) => {
    const mediaStream = await mediaDevices.getUserMedia({
      audio,
      video,
    })
    const peerConnection = new RTCPeerConnection(peerConstraints)
    mediaStream.getTracks().forEach(track => peerConnection.addTrack(track, mediaStream))
    setLocalStream(mediaStream)
  }, [])

  const toggleMicrophone = useCallback(() => {
    if (microphonePermissionGranted) {
      setLocalMediaControl(prev => ({
        ...prev,
        mic: !prev.mic,
      }))
      localStream?.getAudioTracks().forEach(track => {
        localMediaControl?.mic ? (track.enabled = false) : (track.enabled = true)
      })
      if (roomId) {
        const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)
        const participantRef = roomRef.collection(FirestoreCollections.participants).doc(userName)
        participantRef.update({
          mic: !localMediaControl?.mic,
        })
      }
    } else {
      requestMicrophonePermission()
    }
  }, [
    localMediaControl?.mic,
    localStream,
    microphonePermissionGranted,
    requestMicrophonePermission,
    roomId,
    userName,
  ])

  const toggleCamera = useCallback(() => {
    if (cameraPermissionGranted) {
      setLocalMediaControl(prev => ({
        ...prev,
        camera: !prev.camera,
      }))
      localStream?.getVideoTracks().forEach(track => {
        localMediaControl?.camera ? (track.enabled = false) : (track.enabled = true)
      })
      if (roomId) {
        const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)
        const participantRef = roomRef.collection(FirestoreCollections.participants).doc(userName)
        participantRef.update({
          camera: !localMediaControl?.camera,
        })
      }
    } else {
      requestCameraPermission()
    }
  }, [
    cameraPermissionGranted,
    localMediaControl?.camera,
    localStream,
    requestCameraPermission,
    roomId,
    userName,
  ])

  const hangUp = useCallback(async () => {
    localStream?.getTracks()?.forEach(track => {
      track.stop()
    })

    if (remoteStreams) {
      Object.keys(remoteStreams).forEach(remoteStreamKey => {
        remoteStreams[remoteStreamKey].getTracks().forEach(track => track.stop())
      })
    }

    if (peerConnections) {
      Object.keys(peerConnections).forEach(peerConnectionKey => {
        peerConnections[peerConnectionKey].close()
      })
    }

    const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

    // remove room data if no one here
    if (totalParticipants === 1) {
      const batch = database.batch()
      const participants = await roomRef.collection(FirestoreCollections.participants).get()
      const connections = await roomRef.collection(FirestoreCollections.connections).get()
      participants?.forEach(doc => {
        batch.delete(doc.ref)
      })
      connections?.forEach(doc => {
        batch.delete(doc.ref)
      })
      await batch.commit()
      await roomRef.delete()
    } else {
      await roomRef.collection(FirestoreCollections.participants).doc(userName).delete()
      const Filter = firebase.firestore.Filter
      const connectionSnapshot = await roomRef
        .collection(FirestoreCollections.connections)
        .where(Filter.or(Filter('requester', '==', userName), Filter('responder', '==', userName)))
        .get()

      connectionSnapshot?.docs?.forEach?.(async doc => {
        const answerCandidates = await doc.ref.collection(FirestoreCollections.answerCandidates).get()
        const offerCandidates = await doc.ref.collection(FirestoreCollections.offerCandidates).get()
        const batch = database.batch()
        answerCandidates.forEach(answerDoc => {
          batch.delete(answerDoc.ref)
        })
        offerCandidates.forEach(offerDoc => {
          batch.delete(offerDoc.ref)
        })
        await batch.commit()
        doc.ref.delete()
      })
    }

    setRoomId('')
    setScreen(Screen.CreateRoom)
    setRemoteMedias({})
    setRemoteStreams({})
    setPeerConnections({})
    setTotalParticipants(0)
    if (localMediaControl?.camera || localMediaControl?.mic) {
      openMediaDevices(localMediaControl?.mic, localMediaControl?.camera)
    }
  }, [
    localStream,
    remoteStreams,
    peerConnections,
    roomId,
    totalParticipants,
    setRemoteMedias,
    setRemoteStreams,
    setPeerConnections,
    localMediaControl?.camera,
    localMediaControl?.mic,
    userName,
    openMediaDevices,
  ])

  useEffect(() => {
    setLocalMediaControl({
      mic: microphonePermissionGranted,
      camera: cameraPermissionGranted,
    })
    if (cameraPermissionGranted || microphonePermissionGranted) {
      openMediaDevices(microphonePermissionGranted, cameraPermissionGranted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraPermissionGranted, microphonePermissionGranted])

  useEffect(() => {
    // listen snapshot to get total participants
    if (roomId) {
      const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)
      const participantRef = roomRef.collection(FirestoreCollections.participants)
      if (participantRef) {
        participantRef.onSnapshot(snapshot => {
          if (totalParticipants !== snapshot.size) {
            setTotalParticipants(snapshot.size)
          }
          snapshot.docChanges().forEach(async change => {
            const data = change.doc.data()
            if (change.type === 'modified') {
              if (data?.name !== userName) {
                setRemoteMedias(prev => ({
                  ...prev,
                  [data.name]: {
                    camera: data?.camera,
                    mic: data?.mic,
                  },
                }))
              }
            } else if (change.type === 'removed') {
              setRemoteStreams(prev => {
                const newRemoteStreams = {...prev}
                delete newRemoteStreams[data?.name]
                return newRemoteStreams
              })
              setRemoteMedias(prev => {
                const newRemoteMedias = {...prev}
                delete newRemoteMedias[data?.name]
                return newRemoteMedias
              })
            }
          })
        })
      }
    }
  }, [
    totalParticipants,
    roomId,
    userName,
    remoteMediasRef,
    remoteStreamsRef,
    setRemoteMedias,
    setRemoteStreams,
  ])

  const CreateRoomScreen = useCallback(
    () => (
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={[styles.container, styles.spacingBottom]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.flex}>
          <>
            {localStream && localMediaControl?.camera ? (
              <View style={styles.localStream}>
                <RTCView streamURL={localStream.toURL()} style={styles.flex} mirror={true} />
                {!localMediaControl?.mic && (
                  <Control showMuteAudio muteAudioColor={colors.white} containerStyle={styles.localControl} />
                )}
              </View>
            ) : (
              <View style={styles.noCamera}>
                <Avatar title={userName} />
                {!localMediaControl?.mic && (
                  <Control showMuteAudio containerStyle={styles.remoteControlContainer} />
                )}
              </View>
            )}
            <Control
              mediaControl={localMediaControl}
              toggleMicrophone={toggleMicrophone}
              toggleCamera={toggleCamera}
            />
            <TextInput
              style={styles.nameInput}
              value={userName}
              placeholder="Enter display name"
              onChangeText={setUserName}
            />
            <Pressable
              style={[styles.button, !userName && styles.buttonDisabled]}
              onPress={createRoom}
              disabled={!userName}>
              <Text style={styles.buttonTitle}>Create room</Text>
            </Pressable>
            <View style={styles.joinContainer}>
              <TextInput style={styles.input} placeholder="Enter room id" onChangeText={setRoomId} />
              <Pressable
                style={[styles.joinButton, !roomId && styles.buttonDisabled]}
                onPress={checkRoomExist}
                disabled={!roomId}>
                <Text style={styles.buttonTitle}>Join</Text>
              </Pressable>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    ),
    [
      localStream,
      localMediaControl,
      userName,
      toggleMicrophone,
      toggleCamera,
      createRoom,
      roomId,
      checkRoomExist,
    ],
  )

  const mediaDimension = useMemo(
    () => ({
      width: width / (totalParticipants > 3 ? 2 : 1),
      height: height / (totalParticipants > 2 ? 2 : 1),
    }),
    [totalParticipants],
  )

  const renderRemoteStreams = useCallback(
    () =>
      !!remoteStreams &&
      Object.keys(remoteStreams).map(remoteStreamKey => {
        const stream = remoteStreams[remoteStreamKey]
        const media = remoteMedias[remoteStreamKey]
        return (
          <View key={remoteStreamKey}>
            {media?.camera ? (
              <View style={mediaDimension} key={remoteStreamKey}>
                <RTCView streamURL={stream?.toURL()} style={styles.flex} objectFit="cover" />
                {!media?.mic && (
                  <Control
                    showMuteAudio
                    muteAudioColor={colors.white}
                    containerStyle={styles.remoteControlWithCameraOn}
                  />
                )}
              </View>
            ) : (
              <View key={`${remoteStreamKey}-noCamera`} style={[styles.noCameraInRoom, mediaDimension]}>
                <Avatar title={remoteStreamKey} />
                {!media?.mic && <Control showMuteAudio containerStyle={styles.remoteControlContainer} />}
              </View>
            )}
          </View>
        )
      }),
    [mediaDimension, remoteMedias, remoteStreams],
  )

  const InRoomCallScreen = useCallback(
    () => (
      <View style={styles.container}>
        {totalParticipants === 1 ? (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUserText}>
              No one here.{'\n'}Share your room ID for other users to join
            </Text>
          </View>
        ) : (
          <ScrollView>
            <View style={styles.flexWrap}>{renderRemoteStreams()}</View>
          </ScrollView>
        )}
        <DraggableStream stream={localStream} mediaControl={localMediaControl} title={userName} />
        <Clipboard title={roomId} />
        <Control
          hangUp={hangUp}
          mediaControl={localMediaControl}
          toggleMicrophone={toggleMicrophone}
          toggleCamera={toggleCamera}
          containerStyle={styles.controlContainer}
          iconSize={metrics.sMedium}
        />
      </View>
    ),
    [
      totalParticipants,
      renderRemoteStreams,
      localStream,
      localMediaControl,
      userName,
      roomId,
      hangUp,
      toggleMicrophone,
      toggleCamera,
    ],
  )

  switch (screen) {
    case Screen.CreateRoom:
      return CreateRoomScreen()
    case Screen.InRoomCall:
      return InRoomCallScreen()
    default:
      return null
  }
}
