import React from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SizeControl from '../../controls/SizeControl'

const CloseButtonPanel = () => {
  const size = usePropsSelector('size')

  return (
    <>
      <SizeControl value={size} options={['sm', 'md', 'lg']} />
      <ColorsControl label="Color" name="color" enableHues />
    </>
  )
}

export default CloseButtonPanel
