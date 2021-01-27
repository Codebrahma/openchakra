import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { InputLeftElement } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'
import { generatePropId } from '../../../utils/generateId'

export const InputLeftElementPreview: React.FC<{
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
      id: generatePropId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  return (
    <InputLeftElement right="10px" {...propsKeyValue} ref={drop(ref)}>
      {componentChildren.map((key: string) => (
        <ComponentPreview componentName={key} customProps={customProps} />
      ))}
    </InputLeftElement>
  )
}
