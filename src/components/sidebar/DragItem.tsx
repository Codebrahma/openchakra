import React from 'react'
import { useDrag } from 'react-dnd'
import { Text, Box } from '@chakra-ui/core'

const DragItem: React.FC<ComponentItemProps> = ({
  type,
  label,
  custom,
  onDrag,
}) => {
  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: type,
      type: custom ? 'Custom' : type,
      custom,
    },
    collect: monitor => {
      onDrag(monitor.isDragging())
    },
  })

  let boxProps: any = {
    cursor: 'no-drop',
    color: 'whiteAlpha.600',
  }

  boxProps = {
    ref: drag,
    cursor: 'move',
    boxShadow: '0 0px 4px 1px #e2e8f0',
    _hover: {
      boxShadow: '#0C008C 0px 0px 0px 2px',
    },
  }

  return (
    <Box
      rounded="md"
      {...boxProps}
      p={3}
      textAlign="center"
      boxSizing="border-box"
      transition="margin 200ms"
      m={5}
    >
      <Text
        letterSpacing="wide"
        fontSize="sm"
        textTransform="capitalize"
        color="neutrals.900"
      >
        {label}
      </Text>
    </Box>
  )
}

export default DragItem
