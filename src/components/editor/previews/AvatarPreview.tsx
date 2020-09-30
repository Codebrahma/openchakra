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
  getChildrenBy,
} from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const AvatarPreview: React.FC<IPreviewProps & {
  spacing?: BoxProps['marginLeft']
  index?: number
}> = ({ component, spacing, index, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    ['AvatarBadge'],
    undefined,
    boundingPosition,
  )

  let boxProps: any = {
    display: 'inline-block',
    zIndex: index ? 20 - index : null,
  }

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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Avatar ml={index === 0 ? 0 : spacing} {...propsKeyValue} p="0">
        {componentChildren.map((key: string) => (
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
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, ['Avatar'])
  const isCustomComponentsChild = useSelector(
    isChildrenOfCustomComponent(component.id),
  )
  const components = useSelector(
    isCustomComponentsChild ? getCustomComponents : getComponents,
  )
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
  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  let boxProps: any = { display: 'inline' }

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AvatarGroup {...propsKeyValue}>
        {componentChildren.map((key: string, i: number) => (
          <AvatarPreview
            key={key}
            index={i + 1}
            spacing={propsKeyValue.spacing}
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
  const { props: componentProps, ref } = useInteractive(component)
  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  let boxProps: any = {}

  return (
    <Box {...boxProps} ref={ref}>
      <AvatarBadge {...propsKeyValue} />
    </Box>
  )
}

export default AvatarPreview
