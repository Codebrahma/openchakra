import React, { memo } from 'react'

import ColorsControl from '../../controls/ColorsControl'
import SizeControl, { Size } from '../../controls/SizeControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import IconControl from '../../controls/IconControl'
import VariantsControl from '../../controls/VariantsControl'

const ButtonPanel = () => {
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')

  const variantPropValues = ['outline', 'ghost', 'unstyled', 'link', 'solid']
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg']

  return (
    <>
      <ChildrenControl />
      <SizeControl options={sizePropValues} value={size} />
      <VariantsControl
        options={variantPropValues}
        value={variant || 'subtle'}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <IconControl label="Left icon" name="leftIcon" />
      <IconControl label="Right icon" name="rightIcon" />
    </>
  )
}

export default memo(ButtonPanel)
