import React, { memo } from 'react'
import { FormLabel, SimpleGrid, Box } from '@chakra-ui/core'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '../../inputs/InputSuggestion'
import useCustomTheme from '../../../../hooks/useCustomTheme'

type PaddingPanelPropsType = {
  type: 'margin' | 'padding'
}

const ATTRIBUTES = {
  margin: {
    all: 'm',
    left: 'ml',
    right: 'mr',
    bottom: 'mb',
    top: 'mt',
  },
  padding: {
    all: 'p',
    left: 'pl',
    right: 'pr',
    bottom: 'pb',
    top: 'pt',
  },
}

const PaddingPanel = ({ type }: PaddingPanelPropsType) => {
  const { setValueFromEvent } = useForm()

  const all = usePropsSelector(ATTRIBUTES[type].all)
  const left = usePropsSelector(ATTRIBUTES[type].left)
  const right = usePropsSelector(ATTRIBUTES[type].right)
  const bottom = usePropsSelector(ATTRIBUTES[type].bottom)
  const top = usePropsSelector(ATTRIBUTES[type].top)
  const theme = useCustomTheme()

  return (
    <Box mb={4}>
      <FormLabel fontSize="xs" htmlFor="width" textTransform="capitalize">
        {type}
      </FormLabel>
      <Box mb="5px">
        <InputSuggestion
          value={all || ''}
          handleChange={setValueFromEvent}
          name={ATTRIBUTES[type].all}
          placeholder="All"
        >
          {Object.keys(theme.space).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </Box>

      <SimpleGrid columns={2} spacing={1}>
        <InputSuggestion
          value={left || ''}
          handleChange={setValueFromEvent}
          name={ATTRIBUTES[type].left}
          placeholder="Left"
        >
          {Object.keys(theme.space).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>

        <InputSuggestion
          value={right || ''}
          handleChange={setValueFromEvent}
          name={ATTRIBUTES[type].right}
          placeholder="Right"
        >
          {Object.keys(theme.space).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>

        <InputSuggestion
          value={top || ''}
          handleChange={setValueFromEvent}
          name={ATTRIBUTES[type].top}
          placeholder="Top"
        >
          {Object.keys(theme.space).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>

        <InputSuggestion
          value={bottom || ''}
          handleChange={setValueFromEvent}
          name={ATTRIBUTES[type].bottom}
          placeholder="Bottom"
        >
          {Object.keys(theme.space).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </SimpleGrid>
    </Box>
  )
}

export default memo(PaddingPanel)
