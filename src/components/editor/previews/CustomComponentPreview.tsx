import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useInteractive } from '../../../hooks/useInteractive'
import {
  getChildrenBy,
  getPropsBy,
  checkIsContainerComponent,
} from '../../../core/selectors/components'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'
import { generatePropId } from '../../../utils/generateId'
import { useDropComponent } from '../../../hooks/useDropComponent'

const CustomComponentPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const {
    props: visualInteractionProps,
    ref,
    boundingPosition,
  } = useInteractive(component, true, false, true)

  const { props: componentProps } = useInteractive(component, true)

  const isContainerComponent = useSelector(
    checkIsContainerComponent(component.id),
  )
  const boxProps = []

  // If it is a container component, it should be droppable
  // or else it should not be droppable
  const { drop, isOver } = useDropComponent(
    component.id,
    undefined,
    isContainerComponent ? true : false,
    boundingPosition,
  )

  if (isOver && isContainerComponent) {
    boxProps.push({
      id: generatePropId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })
  }

  const componentChildren = useSelector(getChildrenBy(component.type))

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )
  const interactionProps = findAndReplaceExposedPropValue(
    [...visualInteractionProps, ...boxProps],
    customProps,
  )

  return (
    <Box {...interactionProps} ref={drop(ref)}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={
            isContainerComponent
              ? { ...propsKeyValue, ...customProps }
              : propsKeyValue
          }
          customRootParentId={component.id}
          rootComponentChildren={
            isContainerComponent ? component.children : null
          }
        />
      ))}
    </Box>
  )
}

export default CustomComponentPreview
