import React from 'react'
import { useDrag } from 'react-dnd'
import { Box } from '@chakra-ui/core'

const DragImage: React.FC<{
  type: string
  children: React.ReactNode
  onDrag: Function
  isMeta?: boolean
}> = ({ type, children, isMeta, onDrag }) => {
  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: type,
      type: type,
      isMeta,
      custom: false,
    },
    collect: monitor => {
      onDrag(monitor.isDragging())
    },
  })

  const boxProps = {
    ref: drag,
    cursor: 'move',
    _hover: {
      boxShadow: '#0C008C 0px 0px 0px 2px',
    },
  }

  return (
    <Box
      boxSizing="border-box"
      transition="margin 200ms"
      borderRadius="md"
      display="flex"
      alignItems="center"
      {...boxProps}
      width="300px"
      m={5}
    >
      {children}
    </Box>
  )
}

export default DragImage
