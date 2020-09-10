import React, { FunctionComponent, ComponentClass } from 'react'
import { Box } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { getInputTextFocused } from '../../../core/selectors/app'
import { useSelector } from 'react-redux'
import { getCurrentSelectedComponents } from '../../../core/selectors/components'
import ComponentPreview from '../ComponentPreview'

const TextPreview: React.FC<{
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
  const inputTextFocused = useSelector(getInputTextFocused)
  const selectedComponents = useSelector(
    getCurrentSelectedComponents(component.id),
  )

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
      if (selectedComponents[key])
        return (
          <ComponentPreview
            key={key}
            componentName={key}
            disableSelection={inputTextFocused ? true : false}
          />
        )
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
      if (selectedComponents[key])
        return (
          <ComponentPreview
            key={key}
            componentName={key}
            disableSelection={inputTextFocused ? true : false}
          />
        )
      else return key
    }),
  )

  if (isBoxWrapped) {
    let boxProps: any = {}

    return (
      <Box {...boxProps}>{inputTextFocused ? editableChildren : children}</Box>
    )
  }

  return inputTextFocused ? editableChildren : children
}

export default TextPreview
