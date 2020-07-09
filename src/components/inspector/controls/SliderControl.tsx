import React from 'react'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/core'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import usePropsSelector from '../../../hooks/usePropsSelector'

const SliderControl: React.FC<{
  label: string
  htmlFor: string
  min?: number
  max?: number
  step?: number
}> = ({ label, htmlFor, min = 0, max = 100, step = 1 }) => {
  const { setValue } = useForm()
  const value = usePropsSelector(htmlFor)

  return (
    <FormControl label={label} htmlFor={htmlFor}>
      <Slider
        onChange={value => setValue(htmlFor, value)}
        min={min}
        max={max}
        step={step}
        defaultValue={value}
      >
        <SliderTrack />
        <SliderFilledTrack />
        <SliderThumb />
      </Slider>
    </FormControl>
  )
}

export default SliderControl
