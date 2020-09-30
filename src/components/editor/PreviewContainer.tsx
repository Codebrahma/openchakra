import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'
import stringToIconConvertor from '../../utils/stringToIconConvertor'

export const isPropRelatedToIcon = (type: string, propName: string) => {
  if (
    (type === 'Icon' && propName === 'as') ||
    propName === 'icon' ||
    propName === 'leftIcon' ||
    propName === 'rightIcon'
  )
    return true
  return false
}

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

  //Converting the icon in string to reactElement
  Object.keys(propsKeyValue).forEach((key: string) => {
    if (isPropRelatedToIcon(component.type, key))
      propsKeyValue[key] = stringToIconConvertor(key, propsKeyValue[key])
  })

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
