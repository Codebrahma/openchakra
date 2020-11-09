import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import TextControl from '../../controls/TextControl'
import SizeControl, { Size } from '../../controls/SizeControl'

const SpinnerPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

  return (
    <>
      <TextControl label="Label" name="label" />
      <ColorsControl label="Color" name="color" enableHues />
      <ColorsControl label="Empty color" name="emptyColor" enableHues />
      <SizeControl
        id={sizeId}
        options={sizePropValues}
        value={sizeValue || ''}
      />
      <TextControl label="Thickness" name="thickness" />
      <TextControl label="Speed" name="speed" placeholder="0.45s" />
    </>
  )
}

export default memo(SpinnerPanel)
