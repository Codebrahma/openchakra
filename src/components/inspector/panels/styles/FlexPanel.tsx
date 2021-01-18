import React, { memo } from 'react'
import ColorsControl from '../../controls/ColorsControl'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import {
  checkIsCustomPage,
  getSelectedComponent,
  checkIsChildrenOfWrapperComponent,
} from '../../../../core/selectors/components'
import DisplayFlexPanel from './DisplayFlexPanel'
import ChildrenPropAccessControl from '../../controls/ChildrenPropAccessControl'
import ExposeChildrenControl from '../../controls/ExposeChildrenControl'

const FlexPanel = () => {
  const component = useSelector(getSelectedComponent)
  const isCustomPage = useSelector(checkIsCustomPage)
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
      {isCustomPage && !isComponentDerivedFromProps ? (
        <ExposeChildrenControl />
      ) : null}
      {isCustomPage && isChildrenOfWrapperComponent ? (
        <ChildrenPropAccessControl />
      ) : null}
    </Box>
  )
}

export default memo(FlexPanel)
