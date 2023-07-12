import {Text, View, StyleSheet} from 'react-native'
import React, {memo} from 'react'

const RowItem = props => {
  const {label, content, labelStyle, contentStyle} = props
  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Text numberOfLines={3} style={[styles.content, contentStyle]}>
        {content}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    flex: 0.25,
    color: '#212121',
    fontSize: 12,
    lineHeight: 20,
  },
  content: {
    flex: 0.75,
    color: '#212121',
    fontSize: 12,
    lineHeight: 20,
  },
})

export default memo(RowItem)
