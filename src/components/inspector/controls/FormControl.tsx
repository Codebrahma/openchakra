import React, { ReactNode, memo } from 'react'
import { FormControl as ChakraFormControl, Grid, Box } from '@chakra-ui/core'
import PopOverControl from './PopOverControl'

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
  return (
    <ChakraFormControl
      mb={3}
      as={Grid}
      display="flex"
      alignItems="center"
      justifyItems="center"
    >
      <PopOverControl label={label} htmlFor={htmlFor} hasColumn={hasColumn} />
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
