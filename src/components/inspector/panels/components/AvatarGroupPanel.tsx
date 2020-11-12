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

  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propId: maxId, propValue: maxValue } = usePropsSelector('max')

  const sizesArray = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <FormControl label="Size" htmlFor="size">
        <ComboBox
          id={sizeId}
          options={sizesArray}
          value={sizeValue || ''}
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
          id={maxId}
          size="sm"
          onChange={value => setValue(maxId, 'max', value)}
          value={maxValue}
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
