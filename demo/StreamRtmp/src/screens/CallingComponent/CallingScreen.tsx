import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {ApiVideoLiveStreamMethods, ApiVideoLiveStreamView} from '@api.video/react-native-livestream'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.CallingScreen> & PropsWithChildren

export const CallingScreen: React.FC<Props> = ({route}) => {
  const {url, key} = route.params || {}
  const ref = useRef<ApiVideoLiveStreamMethods>(null)
  const [camera, setCamera] = useState('back')

  useEffect(() => {
    ref.current?.startStreaming(key, url)
    return () => {
      ref.current?.stopStreaming()
    }
  }, [key, url])

  return (
    <ScreenContainer style={styles.container}>
      <ApiVideoLiveStreamView
        style={styles.content}
        ref={ref}
        camera={camera}
        enablePinchedZoom={true}
        video={{
          fps: 30,
          resolution: '720p', // Alternatively, you can specify the resolution in pixels: { width: 1280, height: 720 }
          bitrate: 2 * 1024 * 1024, // # 2 Mbps
          gopDuration: 1, // 1 second
        }}
        audio={{
          bitrate: 128000,
          sampleRate: 44100,
          isStereo: true,
        }}
        isMuted={false}
        onConnectionSuccess={() => {
          //do what you want
          console.log('onConnectionSuccess')
        }}
        onConnectionFailed={() => {
          //do what you want
          console.log('onConnectionFailed')
        }}
        onDisconnect={() => {
          //do what you want
          console.log('onDisconnect')
        }}
      />
      <View style={styles.button}>
        <TouchableOpacity
          style={styles.buttonContent}
          onPress={() => {
            setCamera(prev => (prev === 'back' ? 'front' : 'back'))
          }}>
          <Text>{camera}</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'black',
    alignSelf: 'stretch',
  },
  button: {
    position: 'absolute',
    bottom: 40,
  },
  buttonContent: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
