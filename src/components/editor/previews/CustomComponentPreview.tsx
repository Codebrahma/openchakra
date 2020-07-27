import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import { getChildrenBy, getPropsBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { generateId } from '../../../utils/generateId'

const CustomComponentPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { isOver } = useDropComponent(component.id)
  const { props: visualInteractionProps, ref } = useInteractive(
    component,
    true,
    true,
    true,
  )
  const { props: componentProps } = useInteractive(component, true, true)

  const componentChildren = useSelector(getChildrenBy(component.type))

  //width of outer container will be the with of the child component
  const width =
    useSelector(getPropsBy(componentChildren[0])).find(
      prop => prop.name === 'width',
    )?.value || 'fit-content'

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
  const interactionProps = generatePropsKeyValue(
    visualInteractionProps,
    customProps,
  )

  return (
    <Box {...interactionProps} ref={ref} width={width}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={propsKeyValue}
        />
      ))}
    </Box>
  )
}

export default CustomComponentPreview
