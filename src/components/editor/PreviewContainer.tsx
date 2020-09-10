import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'

const PreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  customProps: IProp[]
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
}> = ({
  component,
  type,
  customProps,
  enableVisualHelper,
  isBoxWrapped,
  ...forwardedProps
}) => {
  const { props: componentProps, ref } = useInteractive(
    component,
    enableVisualHelper,
  )

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)
  const children = React.createElement(type, {
    ...propsKeyValue,
    ...forwardedProps,
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
