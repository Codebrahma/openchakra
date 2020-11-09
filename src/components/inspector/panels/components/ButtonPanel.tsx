import React, { memo } from 'react'
import { Input } from '@chakra-ui/core'

import FormControl from '../../controls/FormControl'
import ColorsControl from '../../controls/ColorsControl'
import SizeControl, { Size } from '../../controls/SizeControl'
import ChildrenControl from '../../controls/ChildrenControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import IconControl from '../../controls/IconControl'
import VariantsControl from '../../controls/VariantsControl'
import SwitchControl from '../../controls/SwitchControl'
import { useForm } from '../../../../hooks/useForm'

const ButtonPanel = () => {
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')
  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )
  const {
    propId: loadingTextId,
    propValue: loadingTextValue,
  } = usePropsSelector('loadingText')

  const variantPropValues = ['outline', 'ghost', 'unstyled', 'link', 'solid']
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg']
  const { setValue } = useForm()

  return (
    <>
      <ChildrenControl />
      <SizeControl options={sizePropValues} value={sizeValue} id={sizeId} />
      <VariantsControl
        options={variantPropValues}
        value={variantValue || 'subtle'}
        id={variantId}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <IconControl label="Left icon" name="leftIcon" />
      <IconControl label="Right icon" name="rightIcon" />
      <SwitchControl label="Loading" name="isLoading" />
      <FormControl htmlFor="loadingText" label="loading text">
        <Input
          id={loadingTextId}
          name="loadingText"
          size="sm"
          value={loadingTextValue}
          type="text"
          onChange={e => setValue(loadingTextId, 'loadingText', e.target.value)}
        />
      </FormControl>
    </>
  )
}

export default memo(ButtonPanel)
