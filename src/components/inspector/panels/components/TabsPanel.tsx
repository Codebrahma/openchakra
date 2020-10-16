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
  const { setValueFromEvent } = useForm()

  const variant = usePropsSelector('variant')
  const orientation = usePropsSelector('orientation')
  const size = usePropsSelector('size')

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
      <VariantsControl value={variant} options={variantPropValues} />
      <FormControl label="Orientation" htmlFor="orientation">
        <Select
          name="orientation"
          id="orientation"
          size="sm"
          value={orientation || ''}
          onChange={setValueFromEvent}
        >
          <option>horizontal</option>
          <option>vertical</option>
        </Select>
      </FormControl>
      <SizeControl options={['sm', 'md', 'lg']} value={size || ''} />
      <ColorsControl label="Color Scheme" name="colorScheme" />
    </>
  )
}

export default TabsPanel
