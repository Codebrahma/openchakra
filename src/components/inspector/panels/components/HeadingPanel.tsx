import React, { memo } from 'react'
import FormControl from '../../controls/FormControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl from '../../controls/SizeControl'

const HeadingPanel = () => {
  const size = usePropsSelector('size')
  const sizePropValues = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <ChildrenControl />
      <FormControl label="Size" htmlFor="size">
        <SizeControl options={sizePropValues} value={size} />
      </FormControl>

      <SwitchControl label="Truncated" name="isTruncated" />
    </>
  )
}

export default memo(HeadingPanel)
