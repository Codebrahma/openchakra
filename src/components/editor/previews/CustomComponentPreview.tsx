import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useInteractive } from '../../../hooks/useInteractive'
import { getChildrenBy, getPropsBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const CustomComponentPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: visualInteractionProps, ref } = useInteractive(
    component,
    true,
    false,
    true,
  )

  const { props: componentProps } = useInteractive(component, true, true)

  const componentChildren = useSelector(getChildrenBy(component.type))

  //width of outer container will be the with of the child component
  let widthProp = useSelector(getPropsBy(componentChildren[0])).find(
    prop => prop.name === 'width',
  )
  if (widthProp?.derivedFromComponentType) {
    widthProp = componentProps.find(
      prop => prop.name === widthProp?.derivedFromPropName,
    )
  }

  const width = widthProp ? widthProp.value : 'fit-content'

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
