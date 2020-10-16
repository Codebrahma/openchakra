import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import VariantsControl from '../../controls/VariantsControl'
import SizeControl from '../../controls/SizeControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import IconControl from '../../controls/IconControl'

const IconButtonPanel = () => {
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')

  const variantPropValues = [
    'solid',
    'outline',
    'ghost',
    'link',
    'unstyled',
    'subtle',
  ]

  return (
    <>
      <IconControl name="icon" label="Icon" />
      <SizeControl options={['sm', 'md', 'lg']} value={size || ''} />
      <ColorsControl label="Color" name="Color Scheme" />
      <SwitchControl label="Loading" name="isLoading" />
      <SwitchControl label="Round" name="isRound" />
      <VariantsControl value={variant} options={variantPropValues} />
    </>
  )
}

export default memo(IconButtonPanel)
