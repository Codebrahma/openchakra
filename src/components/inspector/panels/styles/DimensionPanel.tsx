import React, { memo } from 'react'
import { SimpleGrid, Select } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import { useForm } from '../../../../hooks/useForm'
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '../../inputs/InputSuggestion'
import useCustomTheme from '../../../../hooks/useCustomTheme'

const DimensionPanel = () => {
  const { setValueFromEvent } = useForm()
  const overflow = usePropsSelector('overflow')
  const width = usePropsSelector('width')
  const height = usePropsSelector('height')
  const minWidth = usePropsSelector('minWidth')
  const minHeight = usePropsSelector('minHeight')
  const maxWidth = usePropsSelector('maxWidth')
  const maxHeight = usePropsSelector('maxHeight')
  const theme = useCustomTheme()

  return (
    <>
      <FormControl label="Width" htmlFor="width">
        <InputSuggestion
          value={width}
          handleChange={setValueFromEvent}
          name="width"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
      <FormControl label="Height" htmlFor="height">
        <InputSuggestion
          value={height}
          handleChange={setValueFromEvent}
          name="height"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
      <SimpleGrid columns={2} spacing={1} m="10px 0">
        <InputSuggestion
          value={minWidth}
          handleChange={setValueFromEvent}
          name="minWidth"
          placeholder="Min width"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
        <InputSuggestion
          value={minHeight}
          handleChange={setValueFromEvent}
          name="minHeight"
          placeholder="Min Height"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
        <InputSuggestion
          value={maxWidth}
          handleChange={setValueFromEvent}
          name="maxWidth"
          placeholder="Max Width"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
        <InputSuggestion
          value={maxHeight}
          handleChange={setValueFromEvent}
          name="maxHeight"
          placeholder="Max Height"
        >
          {Object.keys(theme.sizes).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </SimpleGrid>
      <FormControl label="Overflow">
        <Select
          size="sm"
          value={overflow || ''}
          onChange={setValueFromEvent}
          name="overflow"
        >
          <option>visible</option>
          <option>hidden</option>
          <option>scroll</option>
        </Select>
      </FormControl>
    </>
  )
}

export default memo(DimensionPanel)
