import React from 'react'
import { Box } from '@chakra-ui/core'
import ComponentPreview from '../ComponentPreview'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import { useSelector } from 'react-redux'
import { getChildrenBy, getAllProps } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const BoxPreview: React.FC<{ component: IComponent }> = ({ component }) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props: componentProps, ref } = useInteractive(component, true)

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
    <Box ref={drop(ref)} {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </Box>
  )
}

export default BoxPreview
