import React, { FunctionComponent, ComponentClass } from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '../../hooks/useInteractive'
import {
  getChildrenBy,
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
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
  customRootParentId?: string
}> = ({
  component,
  type,
  enableVisualHelper = false,
  isBoxWrapped,
  customProps,
  disableSelection,
  customRootParentId,
  ...forwardedProps
}) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props: componentProps, ref } = useInteractive(
    component,
    enableVisualHelper,
    disableSelection ? true : false,
  )

  const childrenProp = componentProps.find(prop => prop.name === 'children')
  const isCustomComponentPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )

  //If the children for the component is exposed, the component becomes un-droppable

  const isDroppable = childrenProp === undefined ? true : false
  const enableInteractive = isCustomComponentPage || !isCustomComponentChild

  let componentChildren = useSelector(getChildrenBy(component.id))

  const customChildrenPropName =
    childrenProp && childrenProp.derivedFromPropName

  if (
    customChildrenPropName &&
    customProps &&
    customProps[customChildrenPropName]
  ) {
    const propValue = customProps[customChildrenPropName]
    componentChildren = [propValue]
  }

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  const propsElement = { ...forwardedProps, ...propsKeyValue }

  const asProp = propsElement.as

  if (!isBoxWrapped) {
    propsElement.ref = isDroppable ? drop(ref) : ref
  }

  if (isOver && isDroppable && enableInteractive) {
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
      <Box {...boxProps} ref={isDroppable ? drop(ref) : ref}>
        {children}
      </Box>
    )
  }

  return asProp === 'span' ? spanChildren : children
}

export default WithChildrenPreviewContainer
