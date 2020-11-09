import React from 'react'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SizeControl from '../../controls/SizeControl'

const CloseButtonPanel = () => {
  const { propValue: sizeValue, propId: sizeId } = usePropsSelector('size')

  return (
    <>
      <SizeControl id={sizeId} value={sizeValue} options={['sm', 'md', 'lg']} />
      <ColorsControl label="Color" name="color" enableHues />
    </>
  )
}

export default CloseButtonPanel
