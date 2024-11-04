import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren, useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {navigate} from '../../navigation/NavigationService'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.PrepareCallingScreen> & PropsWithChildren

export const PrepareCallingScreen: React.FC<Props> = props => {
  const [url, setUrl] = useState(__DEV__ ? 'rtmp://live.restream.io/live' : '')
  const [key, setKey] = useState(__DEV__ ? 're_8305996_9326e5e77851c3564ed8' : '')

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RTMP url:</Text>
        <TextInput
          style={styles.input}
          placeholder="RTMP"
          placeholderTextColor={'#C2C2C2'}
          value={url}
          onChangeText={setUrl}
        />
        <Text style={styles.title}>Secret key:</Text>
        <TextInput
          style={styles.input}
          placeholder="key"
          placeholderTextColor={'#C2C2C2'}
          value={key}
          onChangeText={setKey}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        disabled={!url || !key}
        onPress={() => navigate(RouteKey.CallingScreen, {url, key})}>
        <Text style={styles.buttonText}>Begin Stream</Text>
      </TouchableOpacity>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  title: {
    paddingBottom: 12,
    fontWeight: '500',
    color: 'black',
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C2C2C2',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  button: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'darkcyan',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
})
