import React, { memo } from 'react'
import { useForm } from '../../../../hooks/useForm'
import FormControl from '../../controls/FormControl'
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '../../inputs/InputSuggestion'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const BorderPanel = () => {
  const { setValueFromEvent } = useForm()
  const theme = useCustomTheme()

  const border = usePropsSelector('border')
  const borderRadius = usePropsSelector('borderRadius')

  return (
    <>
      <FormControl label="Border" htmlFor="border">
        <InputSuggestion
          value={border}
          handleChange={setValueFromEvent}
          name="border"
        >
          {Object.keys(theme.borders).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
      <FormControl label="Border Radius" htmlFor="borderRadius">
        <InputSuggestion
          value={borderRadius}
          handleChange={setValueFromEvent}
          name="borderRadius"
        >
          {Object.keys(theme.radii).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
    </>
  )
}

export default memo(BorderPanel)
