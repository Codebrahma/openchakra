import React from 'react'
import { Flex, Text, Switch } from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import {
  getPropByName,
  getSelectedComponent,
} from '../../../core/selectors/components'
import useDispatch from '../../../hooks/useDispatch'
import {
  getAllPagesCode,
  getAllComponentsCode,
} from '../../../core/selectors/code'
import babelQueries from '../../../babel-queries/queries'

const ContainerComponentControl = () => {
  const dispatch = useDispatch()

  const component = useSelector(getSelectedComponent)
  const { type } = component
  const pagesCode = useSelector(getAllPagesCode)
  const componentsCode = useSelector(getAllComponentsCode)
  const isChildrenPropFound =
    useSelector(getPropByName('children')) !== undefined

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      dispatch.components.convertToContainerComponent({
        customComponentType: type,
      })
      setTimeout(() => {
        const updatedPagesCode = babelQueries.convertInstancesToContainerComp(
          pagesCode,
          { componentName: type },
        )
        dispatch.code.resetPagesCode(updatedPagesCode)
      }, 300)
    } else {
      dispatch.components.deleteCustomProp('children')

      setTimeout(() => {
        const updatedPagesCode = babelQueries.convertInstancesToNormalComp(
          pagesCode,
          { componentName: type },
        )
        const updatedComponentCode = babelQueries.deleteCustomChildrenProp(
          componentsCode[type],
        )
        dispatch.code.resetPagesCode(updatedPagesCode)
        dispatch.code.setComponentsCode(updatedComponentCode, type)
      }, 300)
    }
  }
  return (
    <Flex
      mt={4}
      alignItems="center"
      ml={3}
      justifyContent="space-between"
      mr={3}
    >
      <Text p={0} mr={2} color="gray.500" lineHeight="1rem" fontSize="xs">
        Container component
      </Text>
      <Switch
        isChecked={isChildrenPropFound}
        size="sm"
        onChange={switchChangeHandler}
      />
    </Flex>
  )
}

export default ContainerComponentControl
