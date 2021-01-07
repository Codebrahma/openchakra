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
  getCustomComponents,
  getSelectedPage,
  getCustomComponentsProps,
  getComponentBy,
} from '../../../core/selectors/components'
import ActionButton from '../ActionButton'
import useDispatch from '../../../hooks/useDispatch'
import {
  getAllComponentsCode,
  getAllPagesCode,
} from '../../../core/selectors/code'
import { searchRootCustomComponent } from '../../../utils/recursive'
import babelQueries from '../../../babel-queries/queries'
import getPropsThatUseCustomProp from '../../../utils/getPropsThatUseCustomProp'

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
  const isCustomComponentInstance = useSelector(
    isInstanceOfCustomComponent(selectedId),
  )
  const component = useSelector(getComponentBy(selectedId))
  const selectedProp = useSelector(getPropsOfSelectedComp).find(
    prop => prop.name === htmlFor,
  )
  const isPropExposed =
    selectedProp && selectedProp.derivedFromPropName ? true : false

  const customComponents = useSelector(getCustomComponents)
  const customComponentsProps = useSelector(getCustomComponentsProps)

  const componentsCode = useSelector(getAllComponentsCode)
  const pagesCode = useSelector(getAllPagesCode)
  const selectedPage = useSelector(getSelectedPage)
  const isChildOfCustomComponent = customComponents[selectedId]

  let propValue = selectedProp?.value

  // TODO : Needs to be modified after completing the span component plugin
  propValue = Array.isArray(propValue) ? propValue[0] : propValue

  const unExposeBabelQueryHandler = () => {
    if (selectedProp) {
      let rootCustomParentElement: string = ''

      if (isChildOfCustomComponent)
        rootCustomParentElement = searchRootCustomComponent(
          customComponents[selectedId],
          customComponents,
        )
      const options = {
        customComponentName: rootCustomParentElement,
        componentId: selectedId,
        exposedPropName: selectedProp?.name,
        exposedPropValue: propValue,
        customPropName:
          selectedProp?.derivedFromPropName === null
            ? ''
            : selectedProp?.derivedFromPropName,
      }

      const code = isChildOfCustomComponent
        ? componentsCode[rootCustomParentElement]
        : pagesCode[selectedPage]

      const { updatedPagesCode, updatedCode } = babelQueries.unExposeProp(
        code,
        pagesCode,
        options,
      )

      if (isChildOfCustomComponent) {
        dispatch.code.setComponentsCode(updatedCode, rootCustomParentElement)
        dispatch.code.resetPagesCode(updatedPagesCode)
      } else {
        dispatch.code.setPageCode(updatedCode, selectedPage)
      }
    }
  }

  const unExposePropHandler = () => {
    dispatch.components.unexpose(htmlFor || '')
    setTimeout(() => {
      unExposeBabelQueryHandler()
    }, 200)
  }

  const babelCustomPropDeletionQueryHandler = () => {
    const customComponentType = component.type
    const propsUsingCustomProp = getPropsThatUseCustomProp(
      htmlFor || '',
      customComponentType,
      customComponents,
      customComponentsProps,
    )

    const { updatedCode, updatedPagesCode } = babelQueries.deleteCustomProp(
      componentsCode[customComponentType],
      pagesCode,
      {
        customComponentName: customComponentType,
        customPropName: htmlFor || '',
        propsUsingCustomProp,
      },
    )
    dispatch.code.setComponentsCode(updatedCode, customComponentType)
    dispatch.code.resetPagesCode(updatedPagesCode)
  }

  const customPropDeletionHandler = () => {
    dispatch.components.deleteCustomProp(htmlFor || '')
    setTimeout(() => {
      babelCustomPropDeletionQueryHandler()
    }, 200)
  }

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
            onClick={unExposePropHandler}
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
      {isCustomComponentPage && isCustomComponentInstance && !isPropExposed ? (
        <ActionButton
          label="delete Exposed prop"
          icon={<SmallCloseIcon />}
          onClick={customPropDeletionHandler}
        />
      ) : null}
    </ChakraFormControl>
  )
}

export default memo(FormControl)
