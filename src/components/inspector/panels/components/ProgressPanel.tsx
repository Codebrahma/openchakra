import React from 'react'
import ColorsControl from '../../controls/ColorsControl'
import SizeControl from '../../controls/SizeControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SliderControl from '../../controls/SliderControl'

const ProgressPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')

  return (
    <>
      <SliderControl label="Value" htmlFor="value" />
      <SwitchControl label="Has stripe" name="hasStripe" />
      <SwitchControl label="Loading" name="isIndeterminate" />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SizeControl id={sizeId} options={['sm', 'md', 'lg']} value={sizeValue} />
    </>
  )
}

export default ProgressPanel
