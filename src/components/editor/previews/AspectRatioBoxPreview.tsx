import React from 'react'
import { Box, AspectRatioBox } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const AspectRatioBoxPreview: React.FC<IPreviewProps> = ({
  component,
  customProps,
}) => {
  const { props: componentProps, ref } = useInteractive(component, true)

  const componentChildren = useSelector(getChildrenBy(component.id))

  const { drop, isOver } = useDropComponent(
    component.id,
    undefined,
    componentChildren.length === 0,
  )
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

  const boxProps: any = {}

  return (
    <Box {...boxProps} ref={drop(ref)}>
      <AspectRatioBox {...propsKeyValue}>
        {!componentChildren.length ? (
          /*
           * We need at least one children because of the implementation
           * of AspectRatioBox
           */
          <Box />
        ) : (
          <Box>
            <ComponentPreview componentName={componentChildren[0]} />
          </Box>
        )}
      </AspectRatioBox>
    </Box>
  )
}

export default AspectRatioBoxPreview
