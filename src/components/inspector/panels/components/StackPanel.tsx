import React from 'react'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import FormControl from '../../controls/FormControl'
import { Select } from '@chakra-ui/core'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import { useForm } from '../../../../hooks/useForm'

const StackPanel = () => {
  const { setValueFromEvent } = useForm()

  const alignItems = usePropsSelector('alignItems')
  const justifyContent = usePropsSelector('justifyContent')
  const direction = usePropsSelector('direction')

  return (
    <>
      <SwitchControl label="Inline" name="isInline" />
      <SwitchControl label="Wrap children" name="shouldWrapChildren" />
      <TextControl name="spacing" label="Spacing" />
      <FormControl label="Direction">
        <Select
          name="direction"
          size="sm"
          value={direction || ''}
          onChange={setValueFromEvent}
        >
          <option>row</option>
          <option>column</option>
          <option>row-reverse</option>
          <option>column-reverse</option>
        </Select>
      </FormControl>
      <FormControl label="Justify content">
        <Select
          name="justifyContent"
          size="sm"
          value={justifyContent || ''}
          onChange={setValueFromEvent}
        >
          <option>flex-start</option>
          <option>center</option>
          <option>flex-end</option>
          <option>space-between</option>
          <option>space-around</option>
        </Select>
      </FormControl>
      <FormControl label="Align items">
        <Select
          name="alignItems"
          size="sm"
          value={alignItems || ''}
          onChange={setValueFromEvent}
        >
          <option>stretch</option>
          <option>flex-start</option>
          <option>center</option>
          <option>flex-end</option>
          <option>space-between</option>
          <option>space-around</option>
        </Select>
      </FormControl>
    </>
  )
}

export default StackPanel
