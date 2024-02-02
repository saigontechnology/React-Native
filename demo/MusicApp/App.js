import React from 'react'
import {Provider} from 'react-redux'
import {store, persistor} from './src/store/store'
import {PersistGate} from 'redux-persist/integration/react'
import MainLayout from './src/MainLayout'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Text, TextInput, LogBox} from 'react-native'
import './src/locale/I18nConfig'
import {injectStore} from './src/services/networking/axios'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

LogBox.ignoreAllLogs(true)
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false
TextInput.defaultProps = {
  ...TextInput.defaultProps,
  allowFontScaling: false,
  underlineColorAndroid: 'transparent',
}

injectStore(store)

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <MainLayout />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}

export default App
