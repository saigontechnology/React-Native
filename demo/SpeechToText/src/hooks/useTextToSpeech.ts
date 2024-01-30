// useTextToSpeech.js
import {useCallback, useEffect, useState} from 'react'
import Tts, {Options} from 'react-native-tts'

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact')
    Tts.setDefaultRate(0.6, true)
    // Tts.setIgnoreSilentSwitch('ignore')
    Tts.getInitStatus().catch(err => {
      console.log('🚀 ~ Tts.getInitStatus ~ err:', err)
      if (err.code === 'no_engine') {
        Tts.requestInstallEngine()
      }
    })

    Tts.addEventListener('tts-start', event => console.log('start', event))
    Tts.addEventListener('tts-progress', event => console.log('progress', event))
    Tts.addEventListener('tts-finish', event => console.log('finish', event))
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event))

    return () => {
      Tts.stop()
      Tts.removeAllListeners('tts-start')
      Tts.removeAllListeners('tts-progress')
      Tts.removeAllListeners('tts-finish')
      Tts.removeAllListeners('tts-cancel')
    }
  }, [])

  const startSpeak = useCallback((text: string, options?: Options) => {
    Tts.stop()
    Tts.speak(text, options)
    setIsSpeaking(true)
  }, [])

  const stopSpeaking = useCallback(() => {
    Tts.stop()
    setIsSpeaking(false)
  }, [])

  return {startSpeak, stopSpeaking, isSpeaking}
}
