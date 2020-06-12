import React, { ReactNode, memo } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from '../../.././hooks/useDispatch'
import {
  FormLabel,
  FormControl as ChakraFormControl,
  Grid,
  Box,
} from '@chakra-ui/core'
import { isSelectedIdCustomComponent } from '../../../core/selectors/components'

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
  const dispatch = useDispatch()
  const isCustomComponent = useSelector(isSelectedIdCustomComponent)
  const rightClickHandler = (e: any) => {
    e.preventDefault()
    // Check whether the children is present inside custom components
    if (isCustomComponent) {
      const propName = window.prompt('Enter the prop name')
      if (propName && propName.length > 1)
        dispatch.components.addCustomProps({
          name: propName,
          targetedProp: htmlFor || 'default',
        })
    }
  }
  return (
    <ChakraFormControl
      mb={3}
      as={Grid}
      display="flex"
      alignItems="center"
      justifyItems="center"
    >
      <FormLabel
        p={0}
        mr={2}
        color="gray.500"
        lineHeight="1rem"
        width={hasColumn ? '2.5rem' : '90px'}
        fontSize="xs"
        htmlFor={htmlFor}
        onContextMenu={rightClickHandler}
      >
        {label}
      </FormLabel>
      <Box
        display="flex"
        alignItems="center"
        justifyItems="center"
        width={hasColumn ? '30px' : '130px'}
      >
        {children}
      </Box>
    </ChakraFormControl>
  )
}

export default memo(FormControl)
