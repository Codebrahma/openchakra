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
  checkIsCustomPage,
  isInstanceOfCustomComponent,
  getSelectedComponentId,
  getPropsOfSelectedComp,
} from '../../../core/selectors/components'
import UnExposePropButton from '../../actionButtons/UnExposePropButton'
import CustomPropDeletionButton from '../../actionButtons/CustomPropDeletionButton'

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
  const isCustomPage = useSelector(checkIsCustomPage)
  const selectedId = useSelector(getSelectedComponentId)
  const isCustomComponentInstance = useSelector(
    isInstanceOfCustomComponent(selectedId),
  )
  const selectedProp = useSelector(getPropsOfSelectedComp).find(
    prop => prop.name === htmlFor,
  )
  const isPropExposed =
    selectedProp && selectedProp.derivedFromPropName ? true : false

  return (
    <ChakraFormControl
      mb={3}
      as={Grid}
      display="flex"
      alignItems="center"
      justifyItems="center"
    >
      {isCustomPage && !isPropExposed ? (
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
      {isPropExposed && selectedProp !== undefined ? (
        <Box display="flex" alignItems="center">
          <Text
            fontSize="10px"
            cursor="not-allowed"
            fontWeight="bold"
            mr="11px"
          >
            exposed as{' '}
            {isPropExposed && htmlFor && selectedProp.derivedFromPropName}
          </Text>
          <UnExposePropButton propToUnExpose={selectedProp} />
        </Box>
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
      {isCustomPage && isCustomComponentInstance && !isPropExposed ? (
        <CustomPropDeletionButton customPropName={htmlFor || ''} />
      ) : null}
    </ChakraFormControl>
  )
}

export default memo(FormControl)
