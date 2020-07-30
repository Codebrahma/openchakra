import React, { memo, useMemo } from 'react'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/core'
import InputSuggestion from '../../inputs/InputSuggestion'
import { ComboboxOption } from '@reach/combobox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const EffectsPanel = () => {
  const { setValue, setValueFromEvent } = useForm()
  const opacity = usePropsSelector('opacity')
  const shadow = usePropsSelector('shadow')
  const theme = useCustomTheme()

  const normalizedOpacity = useMemo(() => {
    return opacity * 100 || 100
  }, [opacity])

  return (
    <>
      <FormControl label="Opacity">
        <Slider
          min={1}
          onChange={value => setValue('opacity', value / 100)}
          value={normalizedOpacity}
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl label="Shadow" htmlFor="shadow">
        <InputSuggestion
          value={shadow}
          handleChange={setValueFromEvent}
          name="shadow"
        >
          {Object.keys(theme.shadows).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
    </>
  )
}

export default memo(EffectsPanel)
