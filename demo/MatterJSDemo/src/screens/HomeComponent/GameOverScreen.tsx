import {NativeStackScreenProps} from '@react-navigation/native-stack'
import React, {PropsWithChildren} from 'react'
import {ScreenContainer} from '../../components'
import RouteKey from '../../navigation/RouteKey'
import {AppStackParamList} from '../../navigation/types'
import {Pressable, StyleSheet, Text} from 'react-native'
import {FontSizes, colors, metrics} from '../../themes'

type Props = NativeStackScreenProps<AppStackParamList, RouteKey.GameOverScreen> & PropsWithChildren

export const GameOverScreen: React.FC<Props> = ({navigation, route}) => (
  <ScreenContainer style={styles.container}>
    <Text style={[styles.paddingBottom, {fontSize: metrics.large}]}>Game over</Text>
    <Text style={[styles.paddingBottom, {fontSize: metrics.small}]}>
      Total score: {Math.round(route?.params?.totalTime ?? 0)}
    </Text>
    <Pressable
      style={[styles.playButton, styles.paddingBottom]}
      onPress={() => navigation.navigate(RouteKey.GamePlayScreen, {})}>
      <Text style={{color: colors.white}}>Restart</Text>
    </Pressable>
    <Pressable
      onPress={() =>
        navigation.navigate(RouteKey.HomeScreen, {
          userId: '',
        })
      }>
      <Text style={{color: colors.red, fontSize: FontSizes.span}}>Exit</Text>
    </Pressable>
  </ScreenContainer>
)

const styles = StyleSheet.create({
  paddingBottom: {
    marginBottom: metrics.large,
  },
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
