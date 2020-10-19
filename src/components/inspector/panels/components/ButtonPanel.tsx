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
  const size = usePropsSelector('size')
  const variant = usePropsSelector('variant')
  const loadingText = usePropsSelector('loadingText')

  const variantPropValues = ['outline', 'ghost', 'unstyled', 'link', 'solid']
  const sizePropValues: Size[] = ['xs', 'sm', 'md', 'lg']
  const { setValueFromEvent } = useForm()

  return (
    <>
      <ChildrenControl />
      <SizeControl options={sizePropValues} value={size} />
      <VariantsControl
        options={variantPropValues}
        value={variant || 'subtle'}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
      <IconControl label="Left icon" name="leftIcon" />
      <IconControl label="Right icon" name="rightIcon" />
      <SwitchControl label="Loading" name="isLoading" />
      <FormControl htmlFor="loadingText" label="loading text">
        <Input
          id="loadingText"
          name="loadingText"
          size="sm"
          value={loadingText}
          type="text"
          onChange={setValueFromEvent}
        />
      </FormControl>
    </>
  )
}

export default memo(ButtonPanel)
