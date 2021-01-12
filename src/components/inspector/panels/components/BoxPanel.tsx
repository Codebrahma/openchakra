import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import { Box, Flex, useToast, Switch, Text } from '@chakra-ui/core'
import useDispatch from '../../../../hooks/useDispatch'
import { useSelector } from 'react-redux'
import {
  getPropsOfSelectedComp,
  getShowCustomComponentPage,
  getChildrenBy,
  getSelectedComponent,
  checkIsChildrenOfWrapperComponent,
} from '../../../../core/selectors/components'
import ExposeChildrenControl from '../../../actionButtons/ExposeChildrenControl'

const BoxPanel = () => {
  const dispatch = useDispatch()
  const toast = useToast()
  const component = useSelector(getSelectedComponent)
  const props = useSelector(getPropsOfSelectedComp)
  const childrenProp = props.find(prop => prop.name === 'children')
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const children = useSelector(getChildrenBy(component.id))
  const isComponentDerivedFromProps = component.parent === 'Prop'
  const isChildrenExposed = childrenProp?.derivedFromPropName ? true : false

  const asProp = props.find(prop => prop.name === 'as')
  let isSpanElement = false

  if (asProp && asProp.value === 'span') isSpanElement = true

  const isChildrenOfWrapperComponent = useSelector(
    checkIsChildrenOfWrapperComponent(component.id),
  )

  const enableWayToExposeChildren =
    isCustomComponentPage && !isComponentDerivedFromProps && !isSpanElement

  const switchChangeHandler = (e: any) => {
    if (e.target.checked) {
      if (children.length === 0) {
        dispatch.components.exposeProp({
          name: 'children',
          targetedProp: 'children',
        })
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
    } else dispatch.components.unexpose('children')
  }

  return (
    <Box>
      <ColorsControl
        withFullColor
        label="Color"
        name="backgroundColor"
        enableHues
      />
      {enableWayToExposeChildren ? <ExposeChildrenControl /> : null}
      {isCustomComponentPage && isChildrenOfWrapperComponent ? (
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
      ) : null}
    </Box>
  )
}

export default memo(BoxPanel)
