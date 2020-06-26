import React from 'react'
import { Box } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import ComponentPreview from '../ComponentPreview'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import { getCustomComponents } from '../../../core/selectors/components'
import filterExposedProps from '../../../utils/filterExposedProps'

const CustomComponentPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { isOver } = useDropComponent(component.id)
  const { props, ref } = useInteractive(component, true, true)
  const customComponents = useSelector(getCustomComponents)
  const propsToReplace = filterExposedProps(component.exposedProps, customProps)

  if (isOver) {
    props.bg = 'teal.50'
  }
  const propsElement = { ...props, ...propsToReplace }

  return (
    <Box {...propsElement} ref={ref} width="fit-content">
      {customComponents[component.type].children.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={propsElement}
        />
      ))}
    </Box>
  )
}

export default CustomComponentPreview
