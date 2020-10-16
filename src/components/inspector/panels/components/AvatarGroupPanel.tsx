import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SliderControl from '../../controls/SliderControl'
import ComboBox from '../../inputs/ComboBox'

const AvatarGroupPanel = () => {
  const { setValue } = useForm()

  const size = usePropsSelector('size')
  const max = usePropsSelector('max')

  const sizesArray = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          options={sizesArray}
          value={size || ''}
          name="size"
          editable={false}
        />
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
