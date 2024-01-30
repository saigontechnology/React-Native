import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet, Text, Image, TouchableHighlight, ScrollView} from 'react-native'

import Voice, {SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent} from '@react-native-voice/voice'

type State = {
  recognized: string
  pitch: string
  error: string
  end: string
  started: string
  results: string[]
  partialResults: string[]
}

const SpeechToText = () => {
  const [state, setState] = useState<State>({
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  })

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechPartialResults = onSpeechPartialResults
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const onChangeState = useCallback((value: any) => {
    setState(prev => ({...prev, ...value}))
  }, [])

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e)
    onChangeState({started: '√'})
  }

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e)
    onChangeState({recognized: '√'})
  }

  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e)
    onChangeState({end: '√'})
  }

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e)
    onChangeState({error: JSON.stringify(e.error)})
  }

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e)
    onChangeState({results: e.value || []})
  }

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e)
    onChangeState({partialResults: e.value || []})
  }

  const onSpeechVolumeChanged = (e: any) => {
    console.log('onSpeechVolumeChanged: ', e)
    onChangeState({pitch: e.value})
  }

  const startRecognizing = async () => {
    onChangeState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    })

    try {
      await Voice.start('en-US')
    } catch (e) {
      console.error(e)
    }
  }

  const stopRecognizing = async () => {
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e)
    }
  }

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel()
    } catch (e) {
      console.error(e)
    }
  }

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy()
    } catch (e) {
      console.error(e)
    }
    onChangeState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>Press the button and start speaking.</Text>
      <Text style={styles.stat}>{`Started: ${state.started}`}</Text>
      <Text style={styles.stat}>{`Recognized: ${state.recognized}`}</Text>
      <Text style={styles.stat}>{`Pitch: ${state.pitch}`}</Text>
      <Text style={styles.stat}>{`Error: ${state.error}`}</Text>
      <Text style={styles.stat}>Results</Text>
      {state.results.map((result, index) => (
        <Text key={`result-${index}`} style={styles.stat}>
          {result}
        </Text>
      ))}
      <Text style={styles.stat}>Partial Results</Text>
      {state.partialResults.map((result, index) => (
        <Text key={`partial-result-${index}`} style={styles.stat}>
          {result}
        </Text>
      ))}
      <Text style={styles.stat}>{`End: ${state.end}`}</Text>
      <TouchableHighlight onPress={startRecognizing}>
        <Image style={styles.button} source={require('../assets/button.png')} />
      </TouchableHighlight>
      <TouchableHighlight onPress={stopRecognizing}>
        <Text style={styles.action}>Stop Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={cancelRecognizing}>
        <Text style={styles.action}>Cancel</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={destroyRecognizer}>
        <Text style={styles.action}>Destroy</Text>
      </TouchableHighlight>
    </ScrollView>
  )
}

export default SpeechToText

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
})
