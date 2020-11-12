import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SizeControl from '../../controls/SizeControl'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import VariantsControl from '../../controls/VariantsControl'

const InputPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propValue: variantValue, propId: variantId } = usePropsSelector(
    'variant',
  )

  const variantPropValues = ['outline', 'unstyled', 'flushed', 'filled']

  return (
    <>
      <SizeControl id={sizeId} options={['sm', 'md', 'lg']} value={sizeValue} />
      <TextControl label="Value" name="value" />
      <TextControl label="Placeholder" name="placeholder" />
      <VariantsControl
        id={variantId}
        value={variantValue}
        options={variantPropValues}
      />
      <SwitchControl label="Invalid" name="isInvalid" />
      <SwitchControl label="Read Only" name="isReadOnly" />
      <SwitchControl label="Full width" name="isFullWidth" />
    </>
  )
}

export default memo(InputPanel)
