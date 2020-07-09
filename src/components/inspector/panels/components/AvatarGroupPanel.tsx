import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SliderControl from '../../controls/SliderControl'

const AvatarGroupPanel = () => {
  const { setValue, setValueFromEvent } = useForm()

  const size = usePropsSelector('size')
  const max = usePropsSelector('max')

  return (
    <>
      <FormControl label="Size" htmlFor="size">
        <Select
          name="size"
          id="size"
          size="sm"
          value={size || ''}
          onChange={setValueFromEvent}
        >
          <option>2xs</option>
          <option>xs</option>
          <option>sm</option>
          <option>md</option>
          <option>lg</option>
          <option>xl</option>
          <option>2xl</option>
        </Select>
      </FormControl>

      <SliderControl
        label="Spacing"
        htmlFor="spacing"
        min={-3}
        max={6}
        step={1}
      />

      <FormControl label="max">
        <NumberInput
          size="sm"
          onChange={value => setValue('max', value)}
          value={max}
          min={1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </>
  )
}

export default memo(AvatarGroupPanel)
