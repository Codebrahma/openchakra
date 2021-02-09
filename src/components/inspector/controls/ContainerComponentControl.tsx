import React from 'react'
import { Flex, Text, Switch } from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import {
  getSelectedComponent,
  checkIsContainerComponent,
} from '../../../core/selectors/components'
import useDispatch from '../../../hooks/useDispatch'
import {
  getAllPagesCode,
  getAllComponentsCode,
} from '../../../core/selectors/code'
import babelQueries from '../../../babel-queries/queries'
import { useQueue } from '../../../hooks/useQueue'

const ContainerComponentControl = () => {
  const dispatch = useDispatch()
  const queue = useQueue()

  const component = useSelector(getSelectedComponent)
  const { type } = component
  const pagesCode = useSelector(getAllPagesCode)
  const componentsCode = useSelector(getAllComponentsCode)
  const isContainerComponent = useSelector(
    checkIsContainerComponent(component.id),
  )

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      dispatch.components.convertToContainerComponent({
        customComponentType: type,
      })
      queue.enqueue(async () => {
        const updatedPagesCode = babelQueries.convertInstancesToContainerComp(
          pagesCode,
          { componentName: type },
        )
        dispatch.code.resetAllPagesCode(updatedPagesCode)
      })
    } else {
      dispatch.components.deleteCustomProp('isContainerComponent')

      queue.enqueue(async () => {
        const updatedPagesCode = babelQueries.convertInstancesToNormalComp(
          pagesCode,
          { componentName: type },
        )
        const updatedComponentCode = babelQueries.deleteCustomChildrenProp(
          componentsCode[type],
        )
        dispatch.code.resetAllPagesCode(updatedPagesCode)
        dispatch.code.setComponentsCode(updatedComponentCode, type)
      })
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
        isChecked={isContainerComponent}
        size="sm"
        onChange={switchChangeHandler}
      />
    </Flex>
  )
}

export default ContainerComponentControl
