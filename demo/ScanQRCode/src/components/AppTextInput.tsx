import React from 'react'
import {StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle} from 'react-native'

interface Props extends TextInputProps {
  label: string
  containerStyle?: ViewStyle
}

export const AppTextInput: React.FC<Props> = ({label, containerStyle, ...props}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput {...props} style={[styles.input, props.style]} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  input: {
    color: 'black',
    borderRadius: 4,
    backgroundColor: '#d9d9d9',
    height: 40,
    paddingHorizontal: 8,
  },
})
