import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import TextControl from '../../controls/TextControl'
import SliderControl from '../../controls/SliderControl'
import NumberControl from '../../controls/NumberControl'

const CircularProgressPanel = () => {
  return (
    <>
      <SliderControl label="Value" htmlFor="value" />

      <TextControl name="size" label="Size" />

      <NumberControl label="Thickness" name="thickness" />

      <ColorsControl withFullColor label="Color" name="color" enableHues />
    </>
  )
}

export default memo(CircularProgressPanel)
