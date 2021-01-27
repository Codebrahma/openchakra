import React, { FunctionComponent, ComponentClass } from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '../../hooks/useInteractive'
import {
  getChildrenBy,
  isChildrenOfCustomComponent,
} from '../../core/selectors/components'
import { useDropComponent } from '../../hooks/useDropComponent'
import ComponentPreview from './ComponentPreview'
import { Box } from '@chakra-ui/core'
import findAndReplaceExposedPropValue from '../../utils/findAndReplaceExposedPropValue'
import { checkIsCustomPage } from '../../core/selectors/page'
import { acceptTypes, rootComponents } from '../../utils/editor'

const WithChildrenPreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
  customProps?: any
  disableSelection?: boolean
  customRootParentId?: string
  rootComponentChildren?: any
}> = ({
  component,
  type,
  enableVisualHelper = false,
  isBoxWrapped,
  customProps,
  disableSelection,
  customRootParentId,
  rootComponentChildren,
  ...forwardedProps
}) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    enableVisualHelper,
    disableSelection,
  )

  // If it is a functional-component or class component,we are taking its display name
  //@ts-ignore
  const componentType: string = type.displayName || type

  const acceptedTypes: ComponentType[] = acceptTypes[componentType]
    ? acceptTypes[componentType]
    : rootComponents

  const { drop, isOver } = useDropComponent(
    component.id,
    acceptedTypes,
    undefined,
    boundingPosition,
  )

  const childrenProp = componentProps.find(prop => prop.name === 'children')
  let componentChildren = useSelector(getChildrenBy(component.id))
  const isCustomPage = useSelector(checkIsCustomPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )

  const isChildrenExposed = childrenProp !== undefined

  const enableInteractive =
    !isChildrenExposed && (isCustomPage || !isCustomComponentChild)

  if (rootComponentChildren && isChildrenExposed)
    componentChildren = [...componentChildren, ...rootComponentChildren]

  //If the children for the component is exposed, the component becomes un-droppable

  const customChildrenPropName =
    childrenProp && childrenProp.derivedFromPropName

  if (
    customChildrenPropName &&
    customChildrenPropName !== 'children' &&
    customProps &&
    customProps[customChildrenPropName]
  ) {
    const propValue = customProps[customChildrenPropName]
    componentChildren = [propValue]
  }

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  const propsElement = { ...forwardedProps, ...propsKeyValue }

  const asProp = propsElement.as

  if (!isBoxWrapped) {
    propsElement.ref = enableInteractive ? drop(ref) : ref
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
        customRootParentId={customRootParentId}
        rootComponentChildren={rootComponentChildren}
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
        {children}
      </Box>
    )
  }

  return asProp === 'span' ? spanChildren : children
}

export default WithChildrenPreviewContainer
