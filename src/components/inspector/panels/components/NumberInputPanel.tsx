import React, { memo } from 'react'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SizeControl from '../../controls/SizeControl'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import NumberControl from '../../controls/NumberControl'

const NumberInputPanel = () => {
  const size = usePropsSelector('size')

  return (
    <>
      <SizeControl options={['sm', 'md', 'lg']} value={size} />
      <TextControl label="Value" name="defaultValue" />
      <NumberControl name="step" label="Step" />
      <NumberControl name="precision" label="Precision" />

      <SwitchControl label="Invalid" name="isInvalid" />
      <SwitchControl label="Read Only" name="isReadOnly" />
      <SwitchControl label="Full width" name="isFullWidth" />
    </>
  )
}

export default memo(NumberInputPanel)
