import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useInteractive } from '../../../hooks/useInteractive'
import { getChildrenBy, getPropsBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { generateId } from '../../../utils/generateId'
import { useDropComponent } from '../../../hooks/useDropComponent'

const CustomComponentPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: visualInteractionProps, ref } = useInteractive(
    component,
    true,
    false,
    true,
  )

  const { drop, isOver } = useDropComponent(component.id)

  const { props: componentProps } = useInteractive(component, true)

  const isWrapperComponent =
    componentProps.findIndex(
      prop => prop.componentId === component.id && prop.name === 'children',
    ) !== -1

  const boxProps = []

  if (isOver && isWrapperComponent) {
    boxProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })
  }

  const componentChildren = useSelector(getChildrenBy(component.type))

  //width of outer container will be the with of the child component
  let widthProp = useSelector(getPropsBy(componentChildren[0])).find(
    prop => prop.name === 'width',
  )
  if (widthProp?.derivedFromComponentType) {
    widthProp = componentProps.find(
      prop => prop.name === widthProp?.derivedFromPropName,
    )
  }

  const width = widthProp ? widthProp.value : '100%'

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)
  const interactionProps = generatePropsKeyValue(
    [...visualInteractionProps, ...boxProps],
    customProps,
  )

  return (
    <Box
      {...interactionProps}
      ref={isWrapperComponent ? drop(ref) : ref}
      width={width}
    >
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={propsKeyValue}
          customRootParentId={component.id}
          rootComponentChildren={
            component.children.length > 0 ? component.children : null
          }
        />
      ))}
    </Box>
  )
}

export default CustomComponentPreview
