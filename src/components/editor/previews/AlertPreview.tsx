import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { Alert, Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generatePropId } from '../../../utils/generateId'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'

const AlertPreview: React.FC<IPreviewProps> = ({ component, customProps }) => {
  const acceptedTypes: ComponentType[] = [
    'AlertIcon',
    'AlertTitle',
    'AlertDescription',
  ]
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    false,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    acceptedTypes,
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

  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Alert {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </Alert>
    </Box>
  )
}

export default AlertPreview
