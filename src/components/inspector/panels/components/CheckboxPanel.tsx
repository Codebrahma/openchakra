import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import ChildrenControl from '../../controls/ChildrenControl'
import FormControl from '../../controls/FormControl'
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
      <FormControl label="Size" htmlFor="size">
        <SizeControl value={size} options={['sm', 'md', 'lg']} />
      </FormControl>
    </>
  )
}

export default memo(CheckboxPanel)
