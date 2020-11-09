import React from 'react'
import { Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import ColorsControl from '../../controls/ColorsControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import SwitchControl from '../../controls/SwitchControl'
import VariantsControl from '../../controls/VariantsControl'
import SizeControl from '../../controls/SizeControl'

const TabsPanel = () => {
  const { setValue } = useForm()

  const { propId: variantId, propValue: variantValue } = usePropsSelector(
    'variant',
  )
  const {
    propId: orientationId,
    propValue: orientationValue,
  } = usePropsSelector('orientation')
  const { propId: sizeId, propValue: sizeValue } = usePropsSelector('size')

  const variantPropValues = [
    'line',
    'enclosed',
    'enclosed-colored',
    'soft-rounded',
    'solid-rounded',
    'unstyled',
  ]

  return (
    <>
      <SwitchControl label="Manual" name="isManual" />
      <SwitchControl label="Fitted" name="isFitted" />
      <VariantsControl
        id={variantId}
        value={variantValue}
        options={variantPropValues}
      />
      <FormControl label="Orientation" htmlFor="orientation">
        <Select
          size="sm"
          value={orientationValue || ''}
          onChange={e => setValue(orientationId, 'orientation', e.target.value)}
        >
          <option>horizontal</option>
          <option>vertical</option>
        </Select>
      </FormControl>
      <SizeControl
        id={sizeId}
        options={['sm', 'md', 'lg']}
        value={sizeValue || ''}
      />
      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default TabsPanel
