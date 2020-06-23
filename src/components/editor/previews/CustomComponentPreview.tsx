import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import { getCustomComponents } from '../../../core/selectors/components'

const CustomComponentPreview: React.FC<{ component: IComponent }> = ({
  component,
}) => {
  const { isOver } = useDropComponent(component.id)
  const { props, ref } = useInteractive(component, true, true)
  const customComponents = useSelector(getCustomComponents)

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <Box {...props} ref={ref} width="fit-content">
      {customComponents[component.type].children.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={component.props}
        />
      ))}
    </Box>
  )
}

export default CustomComponentPreview
