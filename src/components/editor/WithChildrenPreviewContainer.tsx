import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { useDropComponent } from '../../hooks/useDropComponent'
import ComponentPreview from './ComponentPreview'
import { Box } from '@chakra-ui/core'

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
  let propsToReplace = {}

  if (customProps && component.propRefs) {
    Object.values(component.propRefs).forEach(prop => {
      if (customProps[prop.customPropName])
        propsToReplace = {
          ...propsToReplace,
          [prop.targetedProp]: customProps[prop.customPropName],
        }
    })
  }

  const propsElement = { ...props, ...forwardedProps, ...propsToReplace }
  if (!isBoxWrapped) {
    propsElement.ref = drop(ref)
  }

  if (isOver) {
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
      <Box {...boxProps} ref={drop(ref)}>
        {children}
      </Box>
    )
  }

  return children
}

export default WithChildrenPreviewContainer
