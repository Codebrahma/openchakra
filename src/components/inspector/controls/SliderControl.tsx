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
  const { propId, propValue } = usePropsSelector(htmlFor)

  return (
    <FormControl label={label} htmlFor={htmlFor}>
      <Slider
        onChange={value => setValue(propId, htmlFor, propValue)}
        min={min}
        max={max}
        step={step}
        defaultValue={propValue}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </FormControl>
  )
}

export default SliderControl
