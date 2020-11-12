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
import ComboBox from '../../inputs/ComboBox'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const EffectsPanel = () => {
  const { setValue } = useForm()
  const { propId: opacityId, propValue: opacityValue } = usePropsSelector(
    'opacity',
  )
  const { propId: shadowId, propValue: shadowValue } = usePropsSelector(
    'shadow',
  )
  const theme = useCustomTheme()

  const normalizedOpacity = useMemo(() => {
    return opacityValue * 100 || 100
  }, [opacityValue])

  return (
    <>
      <FormControl label="Opacity">
        <Slider
          min={1}
          onChange={value => setValue(opacityId, 'opacity', value / 100)}
          value={normalizedOpacity}
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl label="Shadow" htmlFor="shadow">
        <ComboBox
          id={shadowId}
          value={shadowValue}
          name="shadow"
          options={Object.keys(theme.shadows)}
        />
      </FormControl>
    </>
  )
}

export default memo(EffectsPanel)
