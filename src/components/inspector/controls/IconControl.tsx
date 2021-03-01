import React, { ReactNode } from 'react'
import * as icons from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/core'
import ComboBox from '../inputs/ComboBox'
import FormControl from './FormControl'
import usePropsSelector from '../../../hooks/usePropsSelector'

type IconControlProps = {
  name: string
  label: string | ReactNode
}

const IconControl: React.FC<IconControlProps> = ({ name, label }) => {
  const { propId, propValue } = usePropsSelector(name)
  const iconsArray = Object.keys(icons).filter((icon) => icon !== 'createIcon')

  return (
    <FormControl label={label} htmlFor={name}>
      <ComboBox
        id={propId}
        editable={false}
        options={iconsArray}
        value={propValue}
        name={name}
        enableAutoComplete={true}
        renderOptions={(option) => {
          const iconName = option
          // @ts-ignore
          const Icon = React.createElement(icons[iconName])
          return (
            <Flex key={option}>
              <Box mr={1}>{Icon}</Box>
              <Text fontSize="12px" fontWeight="bold">
                {iconName}
              </Text>
            </Flex>
          )
        }}
      />
    </FormControl>
  )
}

export default IconControl
