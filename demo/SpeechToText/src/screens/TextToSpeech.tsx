import {Button, FlatList, Keyboard, Slider, StyleSheet, Text, TextInput, View} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import Tts, {Voice} from 'react-native-tts'

type State = {
  voices: Voice[]
  ttsStatus: string
  selectedVoice: null
  speechRate: number
  speechPitch: number
  text: string
}

const TextToSpeech = () => {
  const [state, setState] = useState<State>({
    voices: [],
    ttsStatus: 'initiliazing',
    selectedVoice: null,
    speechRate: 0.5,
    speechPitch: 1,
    text: 'The sun set behind the mountains, casting a warm glow across the valley.',
  })

  useEffect(() => {
    Tts.addEventListener('tts-start', event => onChangeState({ttsStatus: 'started'}))
    Tts.addEventListener('tts-finish', event => onChangeState({ttsStatus: 'finished'}))
    Tts.addEventListener('tts-cancel', event => onChangeState({ttsStatus: 'cancelled'}))
    Tts.setDefaultRate(state.speechRate)
    Tts.setDefaultPitch(state.speechPitch)
    Tts.getInitStatus().then(initTts)
  }, [])

  const onChangeState = useCallback((value: any) => {
    setState(prev => ({...prev, ...value}))
  }, [])

  const initTts = async () => {
    const voices = await Tts.voices()
    const availableVoices = voices
      .filter(v => !v.networkConnectionRequired && !v.notInstalled)
      .map(v => ({id: v.id, name: v.name, language: v.language}))
    let selectedVoice = null
    if (voices && voices.length > 0) {
      selectedVoice = voices[0].id
      try {
        await Tts.setDefaultLanguage(voices[0].language)
      } catch (err) {
        // My Samsung S9 has always this error: "Language is not supported"
        console.log(`setDefaultLanguage error `, err)
      }
      await Tts.setDefaultVoice(voices[0].id)
      onChangeState({
        voices: availableVoices,
        selectedVoice,
        ttsStatus: 'initialized',
      })
    } else {
      onChangeState({ttsStatus: 'initialized'})
    }
  }

  const readText = async () => {
    Tts.stop()
    Tts.speak(state.text)
  }

  const setSpeechRate = async (rate: number) => {
    await Tts.setDefaultRate(rate)
    onChangeState({speechRate: rate})
  }

  const setSpeechPitch = async (rate: number) => {
    await Tts.setDefaultPitch(rate)
    onChangeState({speechPitch: rate})
  }

  const onVoicePress = async (voice: Voice) => {
    try {
      await Tts.setDefaultLanguage(voice.language)
    } catch (err) {
      // My Samsung S9 has always this error: "Language is not supported"
      console.log(`setDefaultLanguage error `, err)
    }
    await Tts.setDefaultVoice(voice.id)
    onChangeState({selectedVoice: voice.id})
  }

  const renderVoiceItem = ({item}: {item: Voice}) => (
    <Button
      title={`${item.language} - ${item.name || item.id}`}
      color={state.selectedVoice === item.id ? undefined : '#969696'}
      onPress={() => onVoicePress(item)}
    />
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`React Native TTS Example`}</Text>

      <Button testID="ReadText" title={`Read text`} onPress={readText} />

      <Text testID="Status" style={styles.label}>{`Status: ${state.ttsStatus || ''}`}</Text>

      <Text style={styles.label}>{`Selected Voice: ${state.selectedVoice || ''}`}</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{`Speed: ${state.speechRate.toFixed(2)}`}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.01}
          maximumValue={0.99}
          value={state.speechRate}
          onSlidingComplete={setSpeechRate}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{`Pitch: ${state.speechPitch.toFixed(2)}`}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={2}
          value={state.speechPitch}
          onSlidingComplete={setSpeechPitch}
        />
      </View>

      <TextInput
        style={styles.textInput}
        multiline={true}
        onChangeText={text => onChangeState({text})}
        value={state.text}
        onSubmitEditing={Keyboard.dismiss}
      />

      <FlatList
        keyExtractor={item => item.id}
        renderItem={renderVoiceItem}
        extraData={state.selectedVoice}
        data={state.voices}
      />
    </View>
  )
}

export default TextToSpeech

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  label: {
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderLabel: {
    textAlign: 'center',
    marginRight: 20,
  },
  slider: {
    width: 150,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    width: '100%',
  },
})
