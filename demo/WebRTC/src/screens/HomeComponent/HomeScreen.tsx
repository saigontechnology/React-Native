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
    // Boolean value if permission is granted
    cameraPermissionGranted,
    microphonePermissionGranted,

    // request permission methods
    requestMicrophonePermission,
    requestCameraPermission,
  } = usePermission()
  const [localMediaControl, setLocalMediaControl] = useState<MediaControl>({
    mic: microphonePermissionGranted,
    camera: cameraPermissionGranted,
  })

  const listenPeerConnections = useCallback(
    async (
      roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
      createdUserName: string,
    ) => {
      roomRef.collection(FirestoreCollections.connections).onSnapshot(connectionSnapshot => {
        // looping changes from collection Connections
        connectionSnapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            const data = change.doc.data()

            // find connections that request answer from current user
            if (data.responder === createdUserName) {
              // get requester's location from collection Participants
              const requestParticipantRef = roomRef
                .collection(FirestoreCollections.participants)
                .doc(data.requester)

              // get requester's data from requester's location
              const requestParticipantData = (await requestParticipantRef.get()).data()

              // store requester's control status in remoteMedias
              setRemoteMedias(prev => ({
                ...prev,
                [data.requester]: {
                  mic: requestParticipantData?.mic,
                  camera: requestParticipantData?.camera,
                },
              }))

              // init requester's remoteStream to add track data from Peer Connection later
              setRemoteStreams(prev => ({
                ...prev,
                [data.requester]: new MediaStream([]),
              }))

              // init PeerConnection
              const peerConnection = new RTCPeerConnection(peerConstraints)

              // add current user's stream to created PC (Peer Connection)
              localStream?.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream)
              })

              // get requester's MediaStream from PC
              peerConnection.addEventListener('track', event => {
                event.streams[0].getTracks().forEach(track => {
                  const remoteStream = remoteStreams[data.requester] ?? new MediaStream([])
                  remoteStream.addTrack(track)

                  // and store in remoteStreams as it's initialized before
                  setRemoteStreams(prev => ({
                    ...prev,
                    [data.requester]: remoteStream,
                  }))
                })
              })

              // get location of connection between requester and current user
              const connectionsCollection = roomRef.collection(FirestoreCollections.connections)
              const connectionRef = connectionsCollection.doc(`${data.requester}-${createdUserName}`)

              // get data from requester-user's connection
              const connectionData = (await connectionRef.get()).data()

              // receive offer SDP and set as remoteDescription
              const offer = connectionData?.offer
              await peerConnection.setRemoteDescription(offer)

              // create answer SDP and set as localDescription
              const answerDescription = await peerConnection.createAnswer()
              await peerConnection.setLocalDescription(answerDescription)

              // send answer to Firestore
              const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
              }
              await connectionRef.update({answer})

              // create answerCandidates collection
              const answerCandidatesCollection = connectionRef.collection(
                FirestoreCollections.answerCandidates,
              )

              // add current user's ICE Candidates to answerCandidates collection
              peerConnection.addEventListener('icecandidate', event => {
                if (event.candidate) {
                  answerCandidatesCollection.add(event.candidate.toJSON())
                }
              })

              // collect Offer's ICE candidates from offerCandidates collection and add in PC
              connectionRef
                .collection(FirestoreCollections.offerCandidates)
                .onSnapshot(iceCandidateSnapshot => {
                  iceCandidateSnapshot.docChanges().forEach(async iceCandidateChange => {
                    if (iceCandidateChange.type === 'added') {
                      await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateChange.doc.data()))
                    }
                  })
                })

              // store peer collections
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
      // loop all participants data
      const participants = await roomRef.collection(FirestoreCollections.participants).get()
      participants.forEach(async participantSnapshot => {
        const participant = participantSnapshot.data()

        // store participant's control status in remoteMedias
        setRemoteMedias(prev => ({
          ...prev,
          [participant.name]: {
            mic: participant?.mic,
            camera: participant?.camera,
          },
        }))

        // init peer connection
        const peerConnection = new RTCPeerConnection(peerConstraints)

        // add current user's stream to created PC (Peer Connection)
        localStream?.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream)
        })

        // get participant's MediaStream from PC
        peerConnection.addEventListener('track', event => {
          event.streams[0].getTracks().forEach(track => {
            const remoteStream = remoteStreams[participant.name] ?? new MediaStream([])
            remoteStream.addTrack(track)

            // and store in remoteStreams as it's initialized before
            setRemoteStreams(prev => ({
              ...prev,
              [participant.name]: remoteStream,
            }))
          })
        })

        // init participant's remoteStream to add track data from Peer Connection later
        setRemoteStreams(prev => ({
          ...prev,
          [participant.name]: new MediaStream([]),
        }))

        // create connection between current user and participant
        const connectionsCollection = roomRef.collection(FirestoreCollections.connections)
        const connectionRef = connectionsCollection.doc(`${createdUserName}-${participant.name}`)

        // create offer SDP and set localDescription
        const offerDescription = await peerConnection.createOffer(sessionConstraints)
        peerConnection.setLocalDescription(offerDescription)

        // send offer to Firestore
        const offer = {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        }
        await connectionRef.set({
          offer,
          requester: createdUserName,
          responder: participant.name,
        })

        // add listener to coming answers
        connectionRef.onSnapshot(async connectionSnapshot => {
          const data = connectionSnapshot.data()
          // if PC does not have any remoteDescription and answer existed
          if (!peerConnection.remoteDescription && data?.answer) {
            // get answer and set as remoteDescription
            const answerDescription = new RTCSessionDescription(data.answer)
            await peerConnection.setRemoteDescription(answerDescription)
          }
        })

        // create offerCandidates collection
        const offerCandidatesCollection = connectionRef.collection(FirestoreCollections.offerCandidates)

        // add current user's ICE Candidates to offerCandidates collection
        peerConnection.addEventListener('icecandidate', event => {
          if (event.candidate) {
            offerCandidatesCollection.add(event.candidate.toJSON())
          }
        })

        // add listener to answerCandidates collection to participant's ICE Candidates
        connectionRef.collection(FirestoreCollections.answerCandidates).onSnapshot(iceCandidatesSnapshot => {
          iceCandidatesSnapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
              // get Answer's ICE candidates and add in PC
              await peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()))
            }
          })
        })

        // store peer connections
        setPeerConnections(prev => ({
          ...prev,
          [participant.name]: peerConnection,
        }))
      })
    },
    [localStream, remoteStreams, setPeerConnections, setRemoteMedias, setRemoteStreams],
  )

  const createRoom = useCallback(async () => {
    // create room with current userName and set createdDate as current datetime
    const roomRef = database.collection(FirestoreCollections.rooms).doc(userName)
    await roomRef.set({createdDate: new Date()})

    // create participants collection to room "userName"
    roomRef.collection(FirestoreCollections.participants).doc(userName).set({
      // control mic and camera status of current user's device
      mic: localMediaControl?.mic,
      camera: localMediaControl?.camera,
      name: userName,
    })
    setRoomId(roomRef.id) // store new created roomId
    setScreen(Screen.InRoomCall) // navigate to InRoomCall screen

    // add listener to new peer connection in Firestore
    await listenPeerConnections(roomRef, userName)
  }, [userName, listenPeerConnections, localMediaControl?.camera, localMediaControl?.mic])

  const joinRoom = useCallback(
    async (roomRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>) => {
      // register new PeerConnection to FireStore
      await registerPeerConnection(roomRef, userName)

      // add user data to participants collection
      await roomRef.collection(FirestoreCollections.participants).doc(userName).set({
        mic: localMediaControl?.mic,
        camera: localMediaControl?.camera,
        name: userName,
      })

      // also listen to new coming PeerConnections
      await listenPeerConnections(roomRef, userName)
      setScreen(Screen.InRoomCall) // navigate to InRoomCall screen
    },
    [
      userName,
      registerPeerConnection,
      localMediaControl?.mic,
      localMediaControl?.camera,
      listenPeerConnections,
    ],
  )

  const checkRoomExist = useCallback(() => {
    // get room data based on the entered room id
    const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

    roomRef.get().then(docSnapshot => {
      if (!docSnapshot.exists) {
        Alert.alert('Room not found')
        setRoomId('')
        return
      } else {
        joinRoom(roomRef) // process to join room if room is existed
      }
    })
  }, [joinRoom, roomId])

  const openMediaDevices = useCallback(async (audio: boolean, video: boolean) => {
    // get media devices stream from webRTC API
    const mediaStream = await mediaDevices.getUserMedia({
      audio,
      video,
    })

    // init peer connection to show user's track locally
    const peerConnection = new RTCPeerConnection(peerConstraints)

    // add track from created mediaStream to peer connection
    mediaStream.getTracks().forEach(track => peerConnection.addTrack(track, mediaStream))

    // set mediaStream in localStream
    setLocalStream(mediaStream)
  }, [])

  const toggleMicrophone = useCallback(() => {
    // check if permission is granted, if not call request permission
    if (microphonePermissionGranted) {
      // update state in local mediaControl
      setLocalMediaControl(prev => ({
        ...prev,
        mic: !prev.mic,
      }))

      // update mic value of localStream
      localStream?.getAudioTracks().forEach(track => {
        localMediaControl?.mic ? (track.enabled = false) : (track.enabled = true)
      })
      if (roomId) {
        // get location of current room that user's in
        const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

        // get location of user's participant data
        const participantRef = roomRef.collection(FirestoreCollections.participants).doc(userName)

        // update mic value in Firestore
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
    // check if permission is granted, if not call request permission
    if (cameraPermissionGranted) {
      // update state in local mediaControl
      setLocalMediaControl(prev => ({
        ...prev,
        camera: !prev.camera,
      }))

      // update camera value of localStream
      localStream?.getVideoTracks().forEach(track => {
        localMediaControl?.camera ? (track.enabled = false) : (track.enabled = true)
      })
      if (roomId) {
        // get location of current room that user's in
        const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

        // get location of user's participant data
        const participantRef = roomRef.collection(FirestoreCollections.participants).doc(userName)

        // update camera value in Firestore
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
    // stop local stream
    localStream?.getTracks()?.forEach(track => {
      track.stop()
    })

    // stop remote streams
    if (remoteStreams) {
      Object.keys(remoteStreams).forEach(remoteStreamKey => {
        remoteStreams[remoteStreamKey].getTracks().forEach(track => track.stop())
      })
    }

    // close peer connections
    if (peerConnections) {
      Object.keys(peerConnections).forEach(peerConnectionKey => {
        peerConnections[peerConnectionKey].close()
      })
    }

    // get location of current room
    const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)

    // remove room data if no one here
    if (totalParticipants === 1) {
      const batch = database.batch()

      // delete all data Participants
      const participants = await roomRef.collection(FirestoreCollections.participants).get()
      participants?.forEach(doc => {
        batch.delete(doc.ref)
      })

      // delete all data Connections
      const connections = await roomRef.collection(FirestoreCollections.connections).get()
      connections?.forEach(doc => {
        batch.delete(doc.ref)
      })

      // delete current room detail data and this room in Rooms
      await batch.commit()
      await roomRef.delete()
    } else {
      // delete user data in Participants collection
      await roomRef.collection(FirestoreCollections.participants).doc(userName).delete()

      // filter data has userName is requester or responder
      const Filter = firebase.firestore.Filter
      const connectionSnapshot = await roomRef
        .collection(FirestoreCollections.connections)
        .where(Filter.or(Filter('requester', '==', userName), Filter('responder', '==', userName)))
        .get()

      // delete all filtered connections one by one
      connectionSnapshot?.docs?.forEach?.(async doc => {
        const batch = database.batch()

        // delete all data answerCandidates
        const answerCandidates = await doc.ref.collection(FirestoreCollections.answerCandidates).get()
        answerCandidates.forEach(answerDoc => {
          batch.delete(answerDoc.ref)
        })

        // delete all data offerCandidates
        const offerCandidates = await doc.ref.collection(FirestoreCollections.offerCandidates).get()
        offerCandidates.forEach(offerDoc => {
          batch.delete(offerDoc.ref)
        })

        // delete connection detail and remove it from Connections
        await batch.commit()
        doc.ref.delete()
      })
    }

    // reset data
    setRoomId('')
    setScreen(Screen.CreateRoom)
    setRemoteMedias({})
    setRemoteStreams({})
    setPeerConnections({})
    setTotalParticipants(0)

    // if user still enable camera or microphone, call openMediaDevices to show it locally
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
    if (roomId) {
      const roomRef = database.collection(FirestoreCollections.rooms).doc(roomId)
      const participantRef = roomRef.collection(FirestoreCollections.participants)
      if (participantRef) {
        // listener to new changes from Participants collection
        participantRef.onSnapshot(snapshot => {
          // get current total participants in Firestore
          if (totalParticipants !== snapshot.size) {
            setTotalParticipants(snapshot.size)
          }

          // loop through new data changes
          snapshot.docChanges().forEach(async change => {
            const data = change.doc.data()
            if (change.type === 'modified') {
              // ignore changes from current user
              if (data?.name !== userName) {
                // update new change in remoteMedias
                setRemoteMedias(prev => ({
                  ...prev,
                  [data.name]: {
                    camera: data?.camera,
                    mic: data?.mic,
                  },
                }))
              }
            } else if (change.type === 'removed') {
              // update remote streams to remove leaver's streams
              setRemoteStreams(prev => {
                const newRemoteStreams = {...prev}
                delete newRemoteStreams[data?.name]
                return newRemoteStreams
              })

              // update remote medias to remove leaver's control status
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
