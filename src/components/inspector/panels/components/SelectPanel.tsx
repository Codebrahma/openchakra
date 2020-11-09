import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import IconControl from '../../controls/IconControl'
import VariantsControl from '../../controls/VariantsControl'
import SizeControl from '../../controls/SizeControl'

const SelectPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )

  const variantPropValues = ['outline', 'unstyled', 'flushed', 'filled']

  return (
    <>
      <TextControl label="Placeholder" name="placeholder" />
      <SizeControl
        id={sizeId}
        options={['sm', 'md', 'lg']}
        value={sizeValue || ''}
      />
      <IconControl label="Icon" name="icon" />
      <TextControl label="Icon size" name="iconSize" />
      <VariantsControl
        id={variantId}
        value={variantValue}
        options={variantPropValues}
      />
      <SwitchControl label="Invalid" name="isInvalid" />
      <SwitchControl label="Read Only" name="isReadOnly" />
    </>
  )
}

export default memo(SelectPanel)
