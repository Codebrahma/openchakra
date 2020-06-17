import React from 'react'
import {
  Avatar,
  AvatarGroup,
  Box,
  AvatarBadge,
  BoxProps,
} from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import ComponentPreview from '../ComponentPreview'
import { useSelector } from 'react-redux'
import {
  getComponents,
  getCustomComponents,
  isChildrenOfCustomComponent,
} from '../../../core/selectors/components'
import filterExposedProps from '../../../utils/filterExposedProps'

const AvatarPreview: React.FC<IPreviewProps & {
  spacing?: BoxProps['marginLeft']
  index?: number
}> = ({ component, spacing, index, customProps }) => {
  const { drop, isOver } = useDropComponent(component.id, ['AvatarBadge'])
  const { props, ref } = useInteractive(component)
  const propsToReplace = filterExposedProps(component.exposedProps, customProps)

  let boxProps: any = {
    display: 'inline-block',
    zIndex: index ? 20 - index : null,
  }

  props.p = 0

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Avatar ml={index === 0 ? 0 : spacing} {...props} {...propsToReplace}>
        {component.children.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </Avatar>
    </Box>
  )
}

export const AvatarGroupPreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, ['Avatar'])
  const isCustomComponentsChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const components = useSelector(
    isCustomComponentsChild ? getCustomComponents : getComponents,
  )
  const propsToReplace = filterExposedProps(component.exposedProps, customProps)

  let boxProps: any = { display: 'inline' }

  if (isOver) {
    props.bg = 'teal.50'
  }

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AvatarGroup {...props} {...propsToReplace}>
        {component.children.map((key: string, i: number) => (
          <AvatarPreview
            key={key}
            index={i + 1}
            spacing={props.spacing}
            component={components[key]}
            customProps={customProps}
          />
        ))}
      </AvatarGroup>
    </Box>
  )
}

export const AvatarBadgePreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props, ref } = useInteractive(component)
  let boxProps: any = {}
  const propsToReplace = filterExposedProps(component.exposedProps, customProps)
  return (
    <Box {...boxProps} ref={ref}>
      <AvatarBadge {...props} {...propsToReplace} />
    </Box>
  )
}

export default AvatarPreview
