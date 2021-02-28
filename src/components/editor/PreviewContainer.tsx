import React, { FunctionComponent, ComponentClass, Suspense } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'
import findAndReplaceExposedPropValue from '../../utils/findAndReplaceExposedPropValue'
import reactIcon from '../../utils/stringToIconConvertor'
import { useDropComponent } from '../../hooks/useDropComponent'
import {
  isInlineIconComponent,
  isInlineIconString,
} from '../../utils/isInlineIcon'

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
    if (isInlineIconString(component.type, key)) {
      propsKeyValue[key] = reactIcon(propsKeyValue[key])
    }
    if (isInlineIconComponent(key)) {
      propsKeyValue[key] = React.createElement(reactIcon(propsKeyValue[key]))
    }
  })

  let props = {
    ...propsKeyValue,
    ...forwardedProps,
    ref: drop(ref),
  }
  if (component.type === 'Icon') {
    delete props.ref
  }

  const children = (
    <Suspense fallback={'.'}>{React.createElement(type, props)}</Suspense>
  )

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
