import React from 'react'
import {Controller} from 'react-hook-form'
import {UseControllerProps} from 'react-hook-form/dist/types/controller'
import {TextInput} from './TextInput'
import {TextInputProps} from 'rn-base-component'

interface IProps extends TextInputProps {
  control: UseControllerProps['control']
  id: string
}

export const FormInput = ({control, id, ...rest}: IProps) => (
  <Controller
    control={control}
    render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
      <TextInput {...rest} value={value} onChangeText={onChange} onBlur={onBlur} errorText={error?.message} />
    )}
    name={id}
  />
)
