import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'

const PreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
  customProps?: any
}> = ({
  component,
  type,
  enableVisualHelper,
  isBoxWrapped,
  customProps,
  ...forwardedProps
}) => {
  const { props, ref } = useInteractive(component, enableVisualHelper)
  let propsToReplace = {}
  if (customProps && component.exposedProps) {
    Object.values(component.exposedProps).forEach(prop => {
      if (customProps[prop.customPropName])
        propsToReplace = {
          ...propsToReplace,
          [prop.targetedProp]: customProps[prop.customPropName],
        }
    })
  }

  const children = React.createElement(type, {
    ...props,
    ...forwardedProps,
    ...propsToReplace,
    ref,
  })

  if (isBoxWrapped) {
    let boxProps: any = {}

    return (
      <Box {...boxProps} ref={ref}>
        {children}
      </Box>
    )
  }

  return children
}

export default PreviewContainer
