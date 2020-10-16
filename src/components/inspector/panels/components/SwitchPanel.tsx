import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl from '../../controls/SizeControl'

const SwitchPanel = () => {
  const size = usePropsSelector('size')

  return (
    <>
      <SwitchControl label="Checked" name="isChecked" />
      <SizeControl options={['sm', 'md', 'lg']} value={size || ''} />
      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default memo(SwitchPanel)
