import React from 'react'
import { Box, AspectRatio } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generatePropId } from '../../../utils/generateId'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'

const AspectRatioPreview: React.FC<IPreviewProps> = ({
  component,
  customProps,
}) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )

  const componentChildren = useSelector(getChildrenBy(component.id))

  const { drop, isOver } = useDropComponent(
    component.id,
    undefined,
    componentChildren.length === 0,
    boundingPosition,
  )
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

  const boxProps: any = {}

  return (
    <Box {...boxProps} ref={drop(ref)}>
      <AspectRatio {...propsKeyValue}>
        {!componentChildren.length ? (
          /*
           * We need at least one children because of the implementation
           * of AspectRatio
           */
          <Box />
        ) : (
          <Box>
            <ComponentPreview componentName={componentChildren[0]} />
          </Box>
        )}
      </AspectRatio>
    </Box>
  )
}

export default AspectRatioPreview
