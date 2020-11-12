import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl from '../../controls/SizeControl'

const CheckboxPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')

  return (
    <>
      <ChildrenControl />
      <SwitchControl label="Checked" name="isChecked" />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SizeControl id={sizeId} value={sizeValue} options={['sm', 'md', 'lg']} />
    </>
  )
}

export default memo(CheckboxPanel)
