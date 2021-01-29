import React from 'react'
import { useDrag } from 'react-dnd'
import { Box } from '@chakra-ui/core'

const DragImage: React.FC<{ type: string; children: React.ReactNode }> = ({
  type,
  children,
}) => {
  //every custom component type is changed to custom type because only that type will be accepted in the drop.
  const [, drag] = useDrag({
    item: {
      id: type,
      type: type,
      isMeta: true,
      rootParentType: '',
      custom: false,
    },
  })

  const boxProps = {
    ref: drag,
    cursor: 'move',
    _hover: {
      boxShadow: '0 0px 4px 1px #5d55fa',
    },
  }

  return (
    <Box
      boxSizing="border-box"
      transition="margin 200ms"
      rounded="md"
      display="flex"
      alignItems="center"
      {...boxProps}
      width="100%"
      mb={5}
    >
      {children}
    </Box>
  )
}

export default DragImage
