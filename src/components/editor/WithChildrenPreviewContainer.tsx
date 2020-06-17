import React, { FunctionComponent, ComponentClass } from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '../../hooks/useInteractive'
import {
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
} from '../../core/selectors/components'
import { useDropComponent } from '../../hooks/useDropComponent'
import ComponentPreview from './ComponentPreview'
import { Box } from '@chakra-ui/core'
import filterExposedProps from '../../utils/filterExposedProps'

const WithChildrenPreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
  customProps?: any
}> = ({
  component,
  type,
  enableVisualHelper = false,
  isBoxWrapped,
  customProps,
  ...forwardedProps
}) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props, ref } = useInteractive(component, enableVisualHelper)
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild

  const propsToReplace = filterExposedProps(component.exposedProps, customProps)

  const propsElement = { ...props, ...forwardedProps, ...propsToReplace }
  if (!isBoxWrapped) {
    propsElement.ref = drop(ref)
  }

  if (isOver && enableInteractive) {
    propsElement.bg = 'teal.50'
  }

  const children = React.createElement(
    type,
    propsElement,
    component.children.map((key: string) => (
      <ComponentPreview
        key={key}
        componentName={key}
        customProps={customProps}
      />
    )),
  )

  if (isBoxWrapped) {
    let boxProps: any = {
      display: 'inline',
    }

    return (
      <Box {...boxProps} ref={enableInteractive ? drop(ref) : ref}>
        {children}
      </Box>
    )
  }

  return children
}

export default WithChildrenPreviewContainer
