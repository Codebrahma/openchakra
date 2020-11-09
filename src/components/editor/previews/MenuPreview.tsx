import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import {
  Box,
  Menu,
  MenuList,
  MenuButton,
  MenuGroup,
  MenuItem,
} from '@chakra-ui/core'
import ComponentPreview from '../ComponentPreview'
import { MenuWhitelist } from '../../../utils/editor'
import { useSelector } from 'react-redux'
import { getChildrenBy } from '../../../core/selectors/components'
import { generatePropId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const acceptedTypes = ['MenuButton', 'MenuList'] as ComponentType[]

const MenuPreview: React.FC<IPreviewProps> = ({ component, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    acceptedTypes,
    undefined,
    boundingPosition,
  )

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
  let boxProps: any = {}

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Menu {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </Menu>
    </Box>
  )
}

export const MenuListPreview = ({ component, customProps }: IPreviewProps) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    MenuWhitelist,
    undefined,
    boundingPosition,
  )

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

  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <MenuList {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </MenuList>
    </Box>
  )
}

export const MenuButtonPreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    MenuWhitelist,
    undefined,
    boundingPosition,
  )

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
    <MenuButton ref={drop(ref)} {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={customProps}
        />
      ))}
    </MenuButton>
  )
}

export const MenuItemPreview = ({ component, customProps }: IPreviewProps) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    MenuWhitelist,
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
    <Box ref={drop(ref)} {...boxProps}>
      <MenuItem {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </MenuItem>
    </Box>
  )
}

export const MenuGroupPreview = ({ component, customProps }: IPreviewProps) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop, isOver } = useDropComponent(
    component.id,
    MenuWhitelist,
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
    <Box ref={drop(ref)} {...boxProps}>
      <MenuGroup {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </MenuGroup>
    </Box>
  )
}

export default MenuPreview
