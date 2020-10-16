import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import TextControl from '../../controls/TextControl'
import SizeControl, { Size } from '../../controls/SizeControl'

const SpinnerPanel = () => {
  const size = usePropsSelector('size')
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

  return (
    <>
      <TextControl label="Label" name="label" />
      <ColorsControl label="Color" name="color" enableHues />
      <ColorsControl label="Empty color" name="emptyColor" enableHues />
      <SizeControl options={sizePropValues} value={size || ''} />
      <TextControl label="Thickness" name="thickness" />
      <TextControl label="Speed" name="speed" placeholder="0.45s" />
    </>
  )
}

export default memo(SpinnerPanel)
