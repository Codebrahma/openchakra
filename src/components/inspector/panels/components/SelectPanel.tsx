import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import IconControl from '../../controls/IconControl'
import VariantsControl from '../../controls/VariantsControl'
import SizeControl from '../../controls/SizeControl'

const SelectPanel = () => {
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')

  const variantPropValues = ['outline', 'unstyled', 'flushed', 'filled']

  return (
    <>
      <TextControl label="Placeholder" name="placeholder" />
      <SizeControl options={['sm', 'md', 'lg']} value={size || ''} />
      <IconControl label="Icon" name="icon" />
      <TextControl label="Icon size" name="iconSize" />
      <VariantsControl value={variant} options={variantPropValues} />
      <SwitchControl label="Invalid" name="isInvalid" />
      <SwitchControl label="Read Only" name="isReadOnly" />
    </>
  )
}

export default memo(SelectPanel)
