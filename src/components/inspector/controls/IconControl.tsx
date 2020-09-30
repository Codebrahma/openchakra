import React, { ReactNode } from 'react'
import * as icons from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/core'
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '../inputs/InputSuggestion'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import usePropsSelector from '../../../hooks/usePropsSelector'

type IconControlProps = {
  name: string
  label: string | ReactNode
}

const IconControl: React.FC<IconControlProps> = ({ name, label }) => {
  const { setValueFromEvent } = useForm()

  const value = usePropsSelector(name)

  return (
    <FormControl label={label} htmlFor={name}>
      <InputSuggestion
        value={value}
        handleChange={setValueFromEvent}
        name={name}
      >
        {Object.keys(icons).map((key, index) => {
          const iconName = key
          if (iconName && iconName !== 'createIcon') {
            // @ts-ignore
            const Icon = React.createElement(icons[iconName])
            return (
              <ComboboxOption key={index} value={iconName.toString()}>
                <Flex>
                  <Box mr={1}>{Icon}</Box>
                  <Text fontSize="12px" fontWeight="bold">
                    {iconName}
                  </Text>
                </Flex>
              </ComboboxOption>
            )
          } else return null
        })}
      </InputSuggestion>
    </FormControl>
  )
}

export default IconControl
