import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SizeControl from '../../controls/SizeControl'
import ColorsControl from '../../controls/ColorsControl'
import SwitchControl from '../../controls/SwitchControl'
import ChildrenControl from '../../controls/ChildrenControl'

const RadioPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')

  return (
    <>
      <ChildrenControl />
      <SizeControl id={sizeId} options={['sm', 'md', 'lg']} value={sizeValue} />
      <ColorsControl name="colorScheme" label="Color Scheme" />
      <SwitchControl label="Checked" name="isChecked" />
      <SwitchControl label="Full width" name="isFullWidth" />
      <SwitchControl label="Invalid" name="isInvalid" />
    </>
  )
}

export default memo(RadioPanel)
