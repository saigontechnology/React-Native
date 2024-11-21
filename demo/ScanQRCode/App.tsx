import React from 'react'
import {LogBox, Text} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Provider} from 'react-redux'
import {configureLocalization} from './src/locale/I18nConfig'
import MainLayout from './src/MainLayout'
import {injectStore} from './src/services/networking/axios'
import {store, persistor} from './src/store/store'
import {PersistGate} from 'redux-persist/integration/react'
import {configureReanimatedLogger, ReanimatedLogLevel} from 'react-native-reanimated'

interface TextWithDefaultProps extends Text {
  defaultProps?: {
    allowFontScaling?: boolean
    underlineColorAndroid?: 'transparent'
  }
}

;(Text as unknown as TextWithDefaultProps).defaultProps = {
  ...(Text as unknown as TextWithDefaultProps).defaultProps,
  allowFontScaling: false,
  underlineColorAndroid: 'transparent',
}
LogBox.ignoreAllLogs(true)
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
})

injectStore(store)
configureLocalization('en')

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <MainLayout />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
