import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { InputRightElement } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

export const InputRightElementPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    undefined,
    undefined,
    boundingPosition,
  )
  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromComponentType: null,
      derivedFromPropName: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <InputRightElement right="10px" {...propsKeyValue} ref={drop(ref)}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={customProps}
        />
      ))}
    </InputRightElement>
  )
}
