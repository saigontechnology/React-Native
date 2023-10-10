import {FlatList, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native'
import React, {memo, useCallback, useEffect, useState} from 'react'
import {db} from '../utils'
import {RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc'
import {peerConnection} from '../../App'

interface RoomsProps {
  style?: StyleProp<ViewStyle>
  onJoinRoom: (roomSelected: string) => void
}
export const Rooms = memo<RoomsProps>(({style, onJoinRoom}) => {
  const [rooms, setRooms] = useState<string[]>([])
  const [roomSelected, setRoomSelected] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const getRoomsOnStore = async () => {
    try {
      setIsLoading(true)
      const data = await db.collection('rooms').get({
        source: 'server',
      })
      setRooms(data?.docs.map(doc => doc.id))
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectRoom = useCallback(
    (room: string) => {
      if (room === roomSelected) {
        setRoomSelected('')
      } else {
        setRoomSelected(room)
      }
    },
    [roomSelected],
  )

  useEffect(() => {
    getRoomsOnStore().then()
  }, [])

  const handleCreateRoom = async () => {
    const roomRef = db.collection('rooms').doc()
    const offerCandidates = roomRef.collection('offerCandidates')
    // const answerCandidates = roomRef.collection('answerCandidates')

    // set condition for hanging up call

    //get candidates for caller
    peerConnection.addEventListener('icecandidate', (event: any) => {
      console.log('icecandidate PC', event)
      event.candidate && offerCandidates.add(event.candidate.toJSON())
    })

    //create offer
    const offerDes = await peerConnection.createOffer({
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    })
    await peerConnection.setLocalDescription(offerDes)

    const offer = {
      type: offerDes.type,
      sdp: offerDes.sdp,
    }

    await roomRef.set({offer})
    await roomRef.update({isHangUp: false})

    // listen for remote answer
    // roomRef.onSnapshot(snapshot => {
    //   const data = snapshot.data()
    //   if (!peerConnection.remoteDescription && data?.answer) {
    //     const answer = new RTCSessionDescription(data.answer)
    //     peerConnection.setRemoteDescription(answer)
    //   }
    // })

    // when answered, add candidates to peer connection
    // answerCandidates.onSnapshot(snapshot => {
    //   snapshot.docChanges().forEach(change => {
    //     if (change.type === 'added') {
    //       const candidate = new RTCIceCandidate(change.doc.data())
    //       peerConnection.addIceCandidate(candidate)
    //     }
    //   })
    // })
    await getRoomsOnStore()
  }
  return (
    <View style={styles.containerRooms}>
      <Text style={styles.textRooms}>Rooms</Text>
      <FlatList
        data={rooms}
        refreshing={isLoading}
        onRefresh={getRoomsOnStore}
        renderItem={({item, index}) => (
          <Text
            key={item + index}
            onPress={() => handleSelectRoom(item)}
            style={[styles.text, item === roomSelected ? styles.isSelected : styles.unSelected]}>
            {item}
          </Text>
        )}
      />
      {roomSelected.length > 0 && (
        <TouchableOpacity onPress={() => onJoinRoom(roomSelected)} style={styles.button}>
          <Text style={styles.textButton}>Join Room</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleCreateRoom} style={styles.button}>
        <Text style={styles.textButton}>Create Room</Text>
      </TouchableOpacity>
    </View>
  )
})
Rooms.displayName = 'Rooms'

const styles = StyleSheet.create({
  containerRooms: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  isSelected: {
    backgroundColor: 'rgba(50,0,123,0.5)',
  },
  unSelected: {
    backgroundColor: 'rgba(50,0,123,0.1)',
  },
  text: {
    color: 'black',
    padding: 8,
    fontSize: 16,
    borderRadius: 8,
    margin: 8,
  },
  textRooms: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  containerButton: {
    paddingTop: 16,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(50,0,123, 1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
})
