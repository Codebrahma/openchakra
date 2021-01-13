import React from 'react'
import { useSelector } from 'react-redux'
import { Flex, Text, Switch, useToast } from '@chakra-ui/core'

import {
  getChildrenBy,
  getPropByName,
  getSelectedComponent,
  getCustomComponents,
} from '../../../core/selectors/components'
import useDispatch from '../../../hooks/useDispatch'
import { getAllComponentsCode } from '../../../core/selectors/code'
import { searchRootCustomComponent } from '../../../utils/recursive'
import babelQueries from '../../../babel-queries/queries'

const ChildrenPropAccessControl = () => {
  const dispatch = useDispatch()
  const toast = useToast()

  const component = useSelector(getSelectedComponent)
  const componentsCode = useSelector(getAllComponentsCode)
  const customComponents = useSelector(getCustomComponents)

  const children = useSelector(getChildrenBy(component.id))
  const childrenProp = useSelector(getPropByName('children'))
  const isChildrenExposed = childrenProp?.derivedFromPropName ? true : false

  const switchChangeHandler = (e: any) => {
    const rootCustomParentElement = searchRootCustomComponent(
      customComponents[component.id],
      customComponents,
    )
    if (e.target.checked) {
      if (children.length === 0) {
        dispatch.components.exposeProp({
          name: 'children',
          targetedProp: 'children',
        })

        const updatedCode = babelQueries.exposeProp(
          componentsCode[rootCustomParentElement],
          {
            componentId: component.id,
            propName: 'children',
            targetedPropName: 'children',
          },
        )
        dispatch.code.setComponentsCode(updatedCode, rootCustomParentElement)
      } else {
        toast({
          title: 'Contains Children components',
          description:
            'The children will not exposed if the component already had children components.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      }
    } else {
      dispatch.components.unexpose('children')
      const updatedCode = babelQueries.unExposeProp(
        componentsCode[rootCustomParentElement],
        {
          componentId: component.id,
          exposedPropName: 'children',
          customPropName: 'children',
          exposedPropValue: '',
        },
      )
      dispatch.code.setComponentsCode(updatedCode, rootCustomParentElement)
    }
  }
  return (
    <Flex mt={4} alignItems="center" mb={2}>
      <Text p={0} mr={2} color="gray.500" lineHeight="1rem" fontSize="xs">
        Use children of Root component
      </Text>
      <Switch
        isChecked={isChildrenExposed}
        size="sm"
        onChange={switchChangeHandler}
      />
    </Flex>
  )
}

export default ChildrenPropAccessControl
