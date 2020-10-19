import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl from '../../controls/SizeControl'

const CheckboxPanel = () => {
  const size = usePropsSelector('size')

  return (
    <>
      <ChildrenControl />
      <SwitchControl label="Checked" name="defaultIsChecked" />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SizeControl value={size} options={['sm', 'md', 'lg']} />
    </>
  )
}

export default memo(CheckboxPanel)
