import React, { ReactNode } from 'react'
import { Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import { optionsType } from '../ExposedPropsPanel'

type variantControlPropsType = {
  name: string
  value: string
  type: string
  label?: string | ReactNode
}

const options: optionsType = {
  Button: ['outline', 'ghost', 'unstyled', 'link', 'solid'],
  Input: ['outline', 'unstyled', 'flushed', 'filled'],
  Badge: ['solid', 'outline', 'subtle'],
  Tag: ['solid', 'outline', 'subtle'],
  Select: ['outline', 'unstyled', 'flushed', 'filled'],
  IconButton: ['outline', 'ghost', 'unstyled', 'link', 'solid', 'subtle'],
}

const VariantPanel = (props: variantControlPropsType) => {
  const { setValueFromEvent } = useForm()
  const choices = options[props.type]

  return (
    <FormControl label={props.label} htmlFor={props.name || 'size'}>
      <Select
        size="sm"
        id={props.name || 'size'}
        name={props.name || 'size'}
        value={props.value || ''}
        onChange={setValueFromEvent}
      >
        {choices.map((choice: string) => (
          <option key={choice}>{choice}</option>
        ))}
      </Select>
    </FormControl>
  )
}
export default VariantPanel
