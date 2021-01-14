import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import {
  getPropsOfSelectedComp,
  getShowCustomComponentPage,
  getSelectedComponent,
  checkIsChildrenOfWrapperComponent,
} from '../../../../core/selectors/components'
import ExposeChildrenControl from '../../controls/ExposeChildrenControl'
import ChildrenPropAccessControl from '../../controls/ChildrenPropAccessControl'

const BoxPanel = () => {
  const component = useSelector(getSelectedComponent)
  const props = useSelector(getPropsOfSelectedComp)
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isComponentDerivedFromProps = component.parent === 'Prop'
  const asProp = props.find(prop => prop.name === 'as')
  let isSpanElement = false

  if (asProp && asProp.value === 'span') isSpanElement = true

  const isChildrenOfWrapperComponent = useSelector(
    checkIsChildrenOfWrapperComponent(component.id),
  )

  const enableWayToExposeChildren =
    isCustomComponentPage && !isComponentDerivedFromProps && !isSpanElement

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
        <ChildrenPropAccessControl />
      ) : null}
    </Box>
  )
}

export default memo(BoxPanel)
