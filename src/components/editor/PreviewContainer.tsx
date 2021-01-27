import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'
import findAndReplaceExposedPropValue from '../../utils/findAndReplaceExposedPropValue'
import stringToIconConvertor from '../../utils/stringToIconConvertor'
import { useDropComponent } from '../../hooks/useDropComponent'

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
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    enableVisualHelper,
  )

  //Here useDropComponent is used only for re-ordering
  const { drop } = useDropComponent(
    component.id,
    undefined,
    false,
    boundingPosition,
  )

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  //Converting the icon in string to reactElement
  Object.keys(propsKeyValue).forEach((key: string) => {
    if (isPropRelatedToIcon(component.type, key))
      propsKeyValue[key] = stringToIconConvertor(key, propsKeyValue[key])
  })

  const children = React.createElement(type, {
    ...propsKeyValue,
    ...forwardedProps,
    ref: drop(ref),
  })

  if (isBoxWrapped) {
    let boxProps: any = {}

    return (
      <Box {...boxProps} ref={drop(ref)}>
        {children}
      </Box>
    )
  }

  return children
}

export default PreviewContainer
