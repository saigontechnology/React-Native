import React, {useCallback} from 'react'
import {StyleSheet, Text, Image, Pressable, Clipboard as RNClipBoard} from 'react-native'
import {Images, colors, metrics} from '../themes'

interface IClipboardProps {
  title: string
}

export const Clipboard = ({title}: IClipboardProps) => {
  const onCopy = useCallback(() => {
    RNClipBoard.setString(title)
    console.log('--------------------------------')
    console.log('CLIPBOARD: ', title)
    console.log('--------------------------------')
  }, [title])

  return (
    <Pressable style={styles.container} onPress={onCopy}>
      <Text style={styles.title}>{title}</Text>
      <Image source={Images.copy} style={styles.icon} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    textDecorationLine: 'underline',
    color: colors.dark,
  },
  container: {
    flexDirection: 'row',
    position: 'absolute',
    left: metrics.small,
    bottom: metrics.massive + metrics.huge,
  },
  icon: {
    width: metrics.small,
    height: metrics.small,
    marginLeft: metrics.xxs,
  },
})
