import React, { memo } from 'react'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SizeControl, { Size } from '../../controls/SizeControl'

const HeadingPanel = () => {
  const size = usePropsSelector('size')
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

  return (
    <>
      <ChildrenControl />
      <SizeControl options={sizePropValues} value={size} />
      <SwitchControl label="Truncated" name="isTruncated" />
    </>
  )
}

export default memo(HeadingPanel)
