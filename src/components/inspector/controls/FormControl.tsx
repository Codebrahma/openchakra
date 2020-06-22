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
        <Box display="flex" alignItems="center">
          <Text
            fontSize="10px"
            cursor="not-allowed"
            fontWeight="bold"
            mr="11px"
          >
            Prop is exposed
          </Text>
          <ActionButton
            label="Unexpose"
            icon="small-close"
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
      {isCustomComponentPage && isCustomComponent ? (
        <ActionButton
          label="delete Exposed prop"
          icon="small-close"
          onClick={() =>
            htmlFor && dispatch.components.deleteExposedProp(htmlFor)
          }
        />
      ) : null}
    </ChakraFormControl>
  )
}

export default memo(FormControl)
