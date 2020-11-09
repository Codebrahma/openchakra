import React from 'react'
import { Stack, Box } from '@chakra-ui/core'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import ComponentPreview from '../ComponentPreview'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generatePropId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const StackPreview: React.FC<{ component: IComponent; customProps: any }> = ({
  component,
  customProps,
}) => {
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

  let boxProps: any = {}

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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box {...boxProps} ref={drop(ref)}>
      <Stack {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default StackPreview
