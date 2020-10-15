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
  const value = usePropsSelector(name)
  const iconsArray = Object.keys(icons)

  return (
    <FormControl label={label} htmlFor={name}>
      <ComboBox
        options={iconsArray}
        value={value}
        name={name}
        renderOptions={option => {
          const iconName = option
          if (iconName && iconName !== 'createIcon') {
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
          } else return null
        }}
      />
    </FormControl>
  )
}

export default IconControl
