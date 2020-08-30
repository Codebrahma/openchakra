import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '../../hooks/useInteractive'
import { Box } from '@chakra-ui/core'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'
import { getInputTextFocused } from '../../core/selectors/app'
import { useSelector } from 'react-redux'
import { getComponents } from '../../core/selectors/components'
import ComponentPreview from './ComponentPreview'

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
  const makeEditable = useSelector(getInputTextFocused)
  const components = useSelector(getComponents)

  const componentChildren =
    propsKeyValue.children && Array.isArray(propsKeyValue.children)
      ? propsKeyValue.children
      : [propsKeyValue.children]

  const children = React.createElement(
    type,
    {
      ...propsKeyValue,
      ...forwardedProps,
      ref,
    },
    componentChildren.map((key: string) => {
      if (components[key])
        return <ComponentPreview key={key} componentName={key} />
      else return key
    }),
  )

  const editableChildren = React.createElement(
    type,
    {
      ...propsKeyValue,
      ...forwardedProps,
    },
    componentChildren.map((key: string) => {
      if (components[key])
        return <ComponentPreview key={key} componentName={key} />
      else return key
    }),
  )

  if (isBoxWrapped) {
    let boxProps: any = {}

    return <Box {...boxProps}>{makeEditable ? editableChildren : children}</Box>
  }

  return makeEditable ? editableChildren : children
}

export default PreviewContainer
