import React, { ReactNode, memo } from 'react'
import { useSelector } from 'react-redux'
import {
  FormControl as ChakraFormControl,
  Grid,
  Box,
  FormLabel,
  Text,
} from '@chakra-ui/core'
import PopOverControl from './PopOverControl'
import {
  getShowCustomComponentPage,
  isSelectedIdCustomComponent,
  getExposedPropsForSelectedComponent,
} from '../../../core/selectors/components'

type FormControlPropType = {
  label: ReactNode
  children: ReactNode
  htmlFor?: string
  hasColumn?: boolean
}

const FormControl: React.FC<FormControlPropType> = ({
  label,
  htmlFor,
  children,
  hasColumn,
}) => {
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponent = useSelector(isSelectedIdCustomComponent)
  const exposedProps = useSelector(getExposedPropsForSelectedComponent)
  const isPropExposed = exposedProps && htmlFor && exposedProps[htmlFor]

  return (
    <ChakraFormControl
      mb={3}
      as={Grid}
      display="flex"
      alignItems="center"
      justifyItems="center"
    >
      {isCustomComponentPage && !isCustomComponent && !isPropExposed ? (
        <PopOverControl label={label} htmlFor={htmlFor} hasColumn={hasColumn} />
      ) : (
        <FormLabel
          p={0}
          mr={2}
          color="gray.500"
          lineHeight="1rem"
          width={hasColumn ? '2.5rem' : '90px'}
          fontSize="xs"
          htmlFor={htmlFor}
        >
          {label}
        </FormLabel>
      )}
      {isPropExposed ? (
        <Text fontSize="12px" cursor="not-allowed" fontWeight="bold">
          Prop is exposed
        </Text>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyItems="center"
          width={hasColumn ? '30px' : '130px'}
        >
          {children}
        </Box>
      )}
    </ChakraFormControl>
  )
}

export default memo(FormControl)
