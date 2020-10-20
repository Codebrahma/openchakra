import React from 'react'
import ColorsControl from '../../controls/ColorsControl'
import SizeControl from '../../controls/SizeControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import SliderControl from '../../controls/SliderControl'

const ProgressPanel = () => {
  const size = usePropsSelector('size')

  return (
    <>
      <SliderControl label="Value" htmlFor="value" />
      <SwitchControl label="Has stripe" name="hasStripe" />
      <SwitchControl label="Loading" name="isIndeterminate" />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SizeControl options={['sm', 'md', 'lg']} value={size} />
    </>
  )
}

export default ProgressPanel
