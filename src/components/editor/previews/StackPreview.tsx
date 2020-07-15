import React from 'react'
import { Stack, Box } from '@chakra-ui/core'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import ComponentPreview from '../ComponentPreview'
import { useSelector } from 'react-redux'
import { getAllProps, getChildrenBy } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const StackPreview: React.FC<{ component: IComponent }> = ({ component }) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props: componentProps, ref } = useInteractive(component, true)

  let boxProps: any = {}

  const props = useSelector(getAllProps)
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

  const propsKeyValue = generatePropsKeyValue(componentProps, props)

  return (
    <Box {...boxProps} ref={drop(ref)}>
      <Stack {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </Stack>
    </Box>
  )
}

export default StackPreview
