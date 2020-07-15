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
import { getAllProps, getChildrenBy } from '../../../core/selectors/components'
import { generateId } from '../../../utils/generateId'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const acceptedTypes = ['MenuButton', 'MenuList'] as ComponentType[]

const MenuPreview: React.FC<IPreviewProps> = ({ component }) => {
  const { props: componentProps, ref } = useInteractive(component, true)
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

  return (
    <Box ref={drop(ref)} {...propsKeyValue}>
      <Menu {...props}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </Menu>
    </Box>
  )
}

export const MenuListPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, MenuWhitelist)

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
      <MenuList {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </MenuList>
    </Box>
  )
}

export const MenuButtonPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, MenuWhitelist)

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
    <MenuButton ref={drop(ref)} {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </MenuButton>
  )
}

export const MenuItemPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, MenuWhitelist)

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
    <Box ref={drop(ref)} {...boxProps}>
      <MenuItem {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </MenuItem>
    </Box>
  )
}

export const MenuGroupPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, MenuWhitelist)

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
    <Box ref={drop(ref)} {...boxProps}>
      <MenuGroup {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </MenuGroup>
    </Box>
  )
}

export default MenuPreview
