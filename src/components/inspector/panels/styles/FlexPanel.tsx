import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import {
  getShowCustomComponentPage,
  getSelectedComponent,
  checkIsChildrenOfWrapperComponent,
} from '../../../../core/selectors/components'
import DisplayFlexPanel from './DisplayFlexPanel'
import ChildrenPropAccessControl from '../../controls/ChildrenPropAccessControl'
import ExposeChildrenControl from '../../controls/ExposeChildrenControl'

const FlexPanel = () => {
  const component = useSelector(getSelectedComponent)
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isComponentDerivedFromProps = component.parent === 'Prop'
  const isChildrenOfWrapperComponent = useSelector(
    checkIsChildrenOfWrapperComponent(component.id),
  )

  return (
    <Box>
      <ColorsControl
        withFullColor
        label="Color"
        name="backgroundColor"
        enableHues
      />

      <DisplayFlexPanel />
      {isCustomComponentPage && !isComponentDerivedFromProps ? (
        <ExposeChildrenControl />
      ) : null}
      {isCustomComponentPage && isChildrenOfWrapperComponent ? (
        <ChildrenPropAccessControl />
      ) : null}
    </Box>
  )
}

export default memo(FlexPanel)
