import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import {
  getPropsOfSelectedComp,
  getSelectedComponent,
  checkIsChildrenOfContainerComponent,
} from '../../../../core/selectors/components'
import ExposeChildrenControl from '../../controls/ExposeChildrenControl'
import ChildrenPropAccessControl from '../../controls/ChildrenPropAccessControl'
import { checkIsCustomPage } from '../../../../core/selectors/page'

const BoxPanel = () => {
  const component = useSelector(getSelectedComponent)
  const props = useSelector(getPropsOfSelectedComp)
  const isCustomPage = useSelector(checkIsCustomPage)
  const isComponentDerivedFromProps = component.parent === 'Prop'
  const asProp = props.find(prop => prop.name === 'as')
  let isSpanElement = false

  if (asProp && asProp.value === 'span') isSpanElement = true

  const isChildrenOfWrapperComponent = useSelector(
    checkIsChildrenOfContainerComponent(component.id),
  )

  const enableWayToExposeChildren =
    isCustomPage && !isComponentDerivedFromProps && !isSpanElement

  return (
    <Box>
      <ColorsControl
        withFullColor
        label="Color"
        name="backgroundColor"
        enableHues
      />
      {enableWayToExposeChildren ? <ExposeChildrenControl /> : null}
      {isCustomPage && isChildrenOfWrapperComponent ? (
        <ChildrenPropAccessControl />
      ) : null}
    </Box>
  )
}

export default memo(BoxPanel)
