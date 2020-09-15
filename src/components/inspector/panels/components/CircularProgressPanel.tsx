import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import SliderControl from '../../controls/SliderControl'

const CircularProgressPanel = () => {
  return (
    <>
      <SliderControl label="Value" htmlFor="value" />

      <TextControl name="size" label="Size" />

      <SliderControl
        label="Thickness"
        htmlFor="thickness"
        min={0.1}
        max={1}
        step={0.1}
      />

      <ColorsControl label="Color" name="color" />

      <SwitchControl label="Loading" name="isIndeterminate" />
    </>
  )
}

export default memo(CircularProgressPanel)
