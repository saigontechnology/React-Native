/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Button, Text, View} from 'react-native'
import {useVoice} from '../../hooks/useVoice'
import {useTextToSpeech} from '../../hooks/useTextToSpeech'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.HomeScreen> & PropsWithChildren

const TEXT = 'This is a great day'

const HomeScreen = () => {
  const {result, startRecord, stopRecord} = useVoice()
  const {startSpeak, stopSpeaking} = useTextToSpeech()

  return (
    <ScreenContainer>
      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Speech To Text</Text>
        <Text>value: {result}</Text>
        <Button title="Start Record" onPress={startRecord} />
        <Button title="Stop Record" onPress={stopRecord} />
      </View>

      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Text To Speech</Text>
        <Text>value: {TEXT}</Text>
        <Button title="Start Speak" onPress={() => startSpeak(TEXT)} />
        <Button title="Stop Speak" onPress={stopSpeaking} />
      </View>
    </ScreenContainer>
  )
}

export default HomeScreen
