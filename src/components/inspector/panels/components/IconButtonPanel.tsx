import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import VariantsControl from '../../controls/VariantsControl'
import SizeControl from '../../controls/SizeControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import IconControl from '../../controls/IconControl'

const IconButtonPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )

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
      <SizeControl
        id={sizeId}
        options={['sm', 'md', 'lg']}
        value={sizeValue || ''}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <SwitchControl label="Loading" name="isLoading" />
      <SwitchControl label="Round" name="isRound" />
      <VariantsControl
        id={variantId}
        value={variantValue}
        options={variantPropValues}
      />
    </>
  )
}

export default memo(IconButtonPanel)
