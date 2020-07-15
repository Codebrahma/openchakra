import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { Alert, Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getChildrenBy, getAllProps } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const AlertPreview: React.FC<IPreviewProps> = ({ component }) => {
  const acceptedTypes = [
    'AlertIcon',
    'AlertTitle',
    'AlertDescription',
  ] as ComponentType[]
  const { props: componentProps, ref } = useInteractive(component, false)
  const { drop, isOver } = useDropComponent(component.id, acceptedTypes)

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

  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Alert {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </Alert>
    </Box>
  )
}

export default AlertPreview
