import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { InputLeftElement } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { generateId } from '../../../utils/generateId'

export const InputLeftElementPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props: componentProps, ref } = useInteractive(component, true)

  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <InputLeftElement
      top="10px"
      right="10px"
      {...propsKeyValue}
      ref={drop(ref)}
    >
      {componentChildren.map((key: string) => (
        <ComponentPreview componentName={key} customProps={customProps} />
      ))}
    </InputLeftElement>
  )
}
