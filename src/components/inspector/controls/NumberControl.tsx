import React, { ReactNode, useCallback } from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
} from '@chakra-ui/core'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import usePropsSelector from '../../../hooks/usePropsSelector'

type NumberControlPropsType = NumberInputProps & {
  name: string
  label: string | ReactNode
}

const NumberControl: React.FC<NumberControlPropsType> = ({
  name,
  label,
  ...props
}) => {
  const { setValue } = useForm()
  const value = usePropsSelector(name)

  const onChange = useCallback(
    (val: React.ReactText) => {
      setValue(name, val)
    },
    [name, setValue],
  )

  return (
    <FormControl htmlFor={name} label={label}>
      <NumberInput size="sm" value={value} onChange={onChange} {...props}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  )
}

export default NumberControl
