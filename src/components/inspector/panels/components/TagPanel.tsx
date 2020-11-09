import React from 'react'
import SizeControl from '../../controls/SizeControl'
import VariantsControl from '../../controls/VariantsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'

const TagPanel = () => {
  const { propValue: sizeValue, propId: sizeId } = usePropsSelector('size')
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )

  return (
    <>
      <ChildrenControl />
      <SizeControl id={sizeId} options={['sm', 'md', 'lg']} value={sizeValue} />
      <VariantsControl
        id={variantId}
        value={variantValue}
        options={['solid', 'outline', 'subtle']}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SwitchControl label="Inline" name="isInline" />
    </>
  )
}

export default TagPanel
