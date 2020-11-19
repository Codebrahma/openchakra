import React, { ReactNode, memo } from 'react'
import { useSelector } from 'react-redux'
import { FiRepeat } from 'react-icons/fi'
import {
  FormControl as ChakraFormControl,
  Grid,
  Box,
  FormLabel,
  Text,
} from '@chakra-ui/core'
import { SmallCloseIcon } from '@chakra-ui/icons'

import PopOverControl from './PopOverControl'
import {
  getShowCustomComponentPage,
  isInstanceOfCustomComponent,
  getSelectedComponentId,
  getPropsOfSelectedComp,
} from '../../../core/selectors/components'
import ActionButton from '../ActionButton'
import useDispatch from '../../../hooks/useDispatch'

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
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const selectedId = useSelector(getSelectedComponentId)
  const isCustomComponent = useSelector(isInstanceOfCustomComponent(selectedId))
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
      {isCustomComponentPage && !isPropExposed ? (
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
        <Box display="flex" alignItems="center">
          <Text
            fontSize="10px"
            cursor="not-allowed"
            fontWeight="bold"
            mr="11px"
          >
            exposed as{' '}
            {isPropExposed && htmlFor && selectedProp?.derivedFromPropName}
          </Text>
          <ActionButton
            label="Unexpose"
            icon={<FiRepeat />}
            onClick={() => htmlFor && dispatch.components.unexpose(htmlFor)}
          />
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
      {isCustomComponentPage && isCustomComponent && !isPropExposed ? (
        <ActionButton
          label="delete Exposed prop"
          icon={<SmallCloseIcon />}
          onClick={() =>
            htmlFor && dispatch.components.deleteCustomProp(htmlFor)
          }
        />
      ) : null}
    </ChakraFormControl>
  )
}

export default memo(FormControl)
