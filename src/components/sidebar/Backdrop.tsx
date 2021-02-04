import React from 'react'
import { Box } from '@chakra-ui/core'

const Backdrop: React.FC<{ showBackdrop: boolean }> = ({ showBackdrop }) => {
  return (
    <Box
      bg="#000"
      opacity={showBackdrop ? '0.6' : '0'}
      transition="opacity 0.2s ease-in-out"
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      visibility={showBackdrop ? 'visible' : 'hidden'}
    ></Box>
  )
}

export default Backdrop
