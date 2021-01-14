import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Flex, Input, useToast } from '@chakra-ui/core'

import useDispatch from '../../../hooks/useDispatch'
import { generateComponentId } from '../../../utils/generateId'
import {
  getSelectedComponent,
  getPropByName,
  getCustomComponents,
  getSelectedPage,
} from '../../../core/selectors/components'
import { searchRootCustomComponent } from '../../../utils/recursive'
import babelQueries from '../../../babel-queries/queries'
import {
  getCode,
  getAllPagesCode,
  getAllComponentsCode,
} from '../../../core/selectors/code'

const ExposeChildrenControl: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const [name, setName] = useState('')

  const component = useSelector(getSelectedComponent)
  const childrenProp = useSelector(getPropByName('children'))
  const customComponents = useSelector(getCustomComponents)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const pagesCode = useSelector(getAllPagesCode)
  const componentsCode = useSelector(getAllComponentsCode)

  const { id, children } = component
  const isCustomComponentChild = customComponents[id] !== undefined

  const changeHandler = (e: any) => setName(e.target.value)

  const clickHandler = () => {
    if (childrenProp) dispatch.components.unexpose('children')
    else {
      if (children.length === 0 && name.length > 0) {
        if (name === 'children') {
          toast({
            title: 'Custom Prop-name not accepted',
            description:
              'The name children is not allowed as the custom prop-name.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
        } else {
          const newComponentId = generateComponentId()
          dispatch.components.exposeProp({
            name,
            targetedProp: 'children',
            boxId: newComponentId,
          })
          let rootCustomParentElement = ''

          if (isCustomComponentChild) {
            rootCustomParentElement = searchRootCustomComponent(
              component,
              customComponents,
            )
          }

          const {
            updatedCode,
            updatedPagesCode,
          } = babelQueries.exposePropAndUpdateInstances(
            isCustomComponentChild
              ? componentsCode[rootCustomParentElement]
              : code,
            pagesCode,
            {
              customComponentName: rootCustomParentElement,
              componentId: id,
              propName: name,
              targetedPropName: 'children',
              defaultPropValue: '',
              boxId: newComponentId,
            },
          )
          if (isCustomComponentChild) {
            dispatch.code.setComponentsCode(
              updatedCode,
              rootCustomParentElement,
            )
            dispatch.code.resetPagesCode(updatedPagesCode)
          } else dispatch.code.setPageCode(updatedCode, selectedPage)
        }
      } else if (name.length === 0)
        toast({
          title: 'No input given',
          description: 'Please do not leave the input field empty.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })
      else {
        toast({
          title: 'Contains Children components',
          description:
            'The children can not exposed if the component already had children components.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      }
    }
  }
  return (
    <Flex flexDirection="column" alignItems="center">
      <Input
        onChange={changeHandler}
        value={name}
        placeholder="expose children as"
        isDisabled={childrenProp ? true : false}
        _disabled={{
          bg: '#EBEBE4',
          cursor: 'not-allowed',
        }}
        onKeyPress={(e: any) => {
          if (e.which === 13) clickHandler()
        }}
        fontSize="sm"
        width="90%"
      />
      <Button
        onClick={clickHandler}
        mt={2}
        mb={2}
        height="35px"
        fontSize="xs"
        bg="white"
        color="primary.500"
        border="1px solid #5D55FA"
      >
        {childrenProp ? 'UnExpose' : 'Expose'}
      </Button>
    </Flex>
  )
}

export default ExposeChildrenControl
