import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Pressable, Text, StyleSheet} from 'react-native'
import {colors, metrics} from '../../themes'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.HomeScreen> & PropsWithChildren

export const HomeScreen: React.FC<Props> = ({navigation}) => (
  <ScreenContainer style={styles.container}>
    <Text style={{fontSize: metrics.large}}>Demo game</Text>
    <Pressable style={styles.playButton} onPress={() => navigation.navigate(RouteKey.GamePlayScreen)}>
      <Text style={{color: colors.white}}>Play</Text>
    </Pressable>
  </ScreenContainer>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    marginTop: metrics.large,
    padding: metrics.small,
    backgroundColor: colors.black,
    width: '50%',
    alignItems: 'center',
  },
})
