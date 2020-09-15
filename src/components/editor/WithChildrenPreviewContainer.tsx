import React, { FunctionComponent, ComponentClass } from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '../../hooks/useInteractive'
import {
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
  getChildrenBy,
} from '../../core/selectors/components'
import { useDropComponent } from '../../hooks/useDropComponent'
import ComponentPreview from './ComponentPreview'
import { Box } from '@chakra-ui/core'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'

const WithChildrenPreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
  customProps?: any
  disableSelection?: boolean
}> = ({
  component,
  type,
  enableVisualHelper = false,
  isBoxWrapped,
  customProps,
  disableSelection,
  ...forwardedProps
}) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props: componentProps, ref } = useInteractive(
    component,
    enableVisualHelper,
    disableSelection ? true : false,
  )
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild
  const componentChildren = useSelector(getChildrenBy(component.id))

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  const propsElement = { ...forwardedProps, ...propsKeyValue }

  const asProp = propsElement.as

  if (!isBoxWrapped) {
    propsElement.ref = drop(ref)
  }

  if (isOver && enableInteractive) {
    propsElement.bg = 'teal.50'
  }

  const children = React.createElement(
    type,
    propsElement,
    componentChildren.map((key: string) => (
      <ComponentPreview
        key={key}
        componentName={key}
        customProps={customProps}
      />
    )),
  )

  const spanChildren = React.createElement(type, {
    ...propsKeyValue,
    ...forwardedProps,
    ref,
  })

  if (isBoxWrapped) {
    let boxProps: any = {
      display: 'inline',
    }

    return (
      <Box {...boxProps} ref={enableInteractive ? drop(ref) : ref}>
        {asProp === 'span' ? spanChildren : children}
      </Box>
    )
  }

  return asProp === 'span' ? spanChildren : children
}

export default WithChildrenPreviewContainer
