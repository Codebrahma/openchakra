import React from 'react'
import { Image, Box, Text, Spinner, Flex } from '@chakra-ui/core'

import { IMenuComponent } from './SidebarMenuItems'
import DragItem from './DragItem'
import DragImage from './DragImage'

const DraggableMenuItem: React.FC<{
  component: IMenuComponent
  onDrag: Function
}> = ({ component, onDrag }) => {
  const { image, name, label, custom } = component
  if (image) {
    return (
      <DragImage key={name} type={name} onDrag={onDrag}>
        <Image
          src={image}
          borderRadius="md"
          alt={label}
          fallback={<Spinner />}
        />
      </DragImage>
    )
  } else {
    return (
      <DragItem
        key={name}
        label={label}
        type={name as any}
        id={name as any}
        onDrag={onDrag}
        custom={custom}
      >
        {label}
      </DragItem>
    )
  }
}

const MenuItemComponents: React.FC<{
  components: IMenuComponent[]
  onDrag: Function
}> = ({ components, onDrag }) => {
  return (
    <Flex width="100%" flexDirection="column" alignItems="center">
      {components.map(component => {
        if (component.children) {
          return (
            <Box
              borderRadius="md"
              boxShadow="0 0px 4px 1px #e2e8f0"
              bg="white"
              width="90%"
              m={5}
              p={2}
              key={component.name}
            >
              <Text
                fontSize="xs"
                color="gray.500"
                fontWeight="700"
                textAlign="center"
              >
                {component.label.toUpperCase()}
              </Text>
              {component.children.map(child => {
                return (
                  <DraggableMenuItem
                    key={child.name}
                    component={child}
                    onDrag={onDrag}
                  />
                )
              })}
            </Box>
          )
        } else {
          return (
            <DraggableMenuItem
              key={component.name}
              component={component}
              onDrag={onDrag}
            />
          )
        }
      })}
    </Flex>
  )
}

export default MenuItemComponents
