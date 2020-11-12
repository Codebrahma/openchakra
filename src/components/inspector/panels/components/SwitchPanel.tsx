import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl from '../../controls/SizeControl'

const SwitchPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')

  return (
    <>
      <SwitchControl label="Checked" name="isChecked" />
      <SizeControl
        id={sizeId}
        options={['sm', 'md', 'lg']}
        value={sizeValue || ''}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default memo(SwitchPanel)
