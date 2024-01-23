import {useEffect, useState} from 'react'
import Voice, {SpeechErrorEvent, SpeechRecognizedEvent, SpeechResultsEvent} from '@react-native-voice/voice'

export const useVoice = () => {
  const [result, setResult] = useState('')
  const [error, setError] = useState<SpeechErrorEvent['error'] | null>(null)

  useEffect(() => {
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechError = onSpeechError

    return () => {
      removeListeners()
    }
  }, [])

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log(e)
  }

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const value = e?.value?.join(' ') || ''
    setResult(value)
  }

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e.error || null)
  }

  const startRecord = async () => Voice.start('en-US')

  const stopRecord = () => Voice.stop()

  const cancelRecord = () => Voice.cancel()

  const removeListeners = () => Voice.destroy().then(Voice.removeAllListeners)

  return {
    result,
    error,

    startRecord,
    stopRecord,
    cancelRecord,
    removeListeners,
  }
}
