import React from 'react'
import SizeControl from '../../controls/SizeControl'
import VariantsControl from '../../controls/VariantsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'

const TagPanel = () => {
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')

  return (
    <>
      <ChildrenControl />
      <SizeControl options={['sm', 'md', 'lg']} value={size} />
      <VariantsControl
        value={variant}
        options={['solid', 'outline', 'subtle']}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SwitchControl label="Inline" name="isInline" />
    </>
  )
}

export default TagPanel
