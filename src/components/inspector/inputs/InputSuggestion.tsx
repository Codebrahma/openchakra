import React, { useState, ReactNode } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { Input } from '@chakra-ui/core'
import { useForm } from '../../../hooks/useForm'

type FormControlPropType = {
  handleChange: any
  value: any
  name: string
  children: ReactNode
  placeholder?: string
}

const ltrim = (value: string) => {
  if (!value) return value
  return value.replace(/^\s+/g, '')
}

const InputSuggestion: React.FC<FormControlPropType> = ({
  handleChange,
  name,
  value,
  children,
  placeholder,
}) => {
  const { setValue } = useForm()
  const [isFocus, setIsFocus] = useState(false)

  return (
    <Combobox
      openOnFocus
      onSelect={item => {
        setValue(name, item)
      }}
    >
      <ComboboxInput
        onFocus={() => setIsFocus(true)}
        id={name}
        value={ltrim(value)}
        name={name}
        onChange={handleChange}
        as={Input}
        aria-labelledby={name}
        size="sm"
        autoComplete="off"
        placeholder={placeholder ? placeholder : ''}
      />

      {isFocus && (
        <ComboboxPopover>
          <ComboboxList
            style={{ maxHeight: 200, overflow: 'scroll' }}
            aria-labelledby={name}
          >
            {children}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  )
}

export default InputSuggestion
