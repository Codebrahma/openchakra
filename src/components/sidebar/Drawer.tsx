import React from 'react'
import { Box } from '@chakra-ui/core'

const Drawer: React.FC<{
  children: React.ReactNode
  isOpen: boolean
}> = ({ children, isOpen }) => {
  return (
    <Box
      position="absolute"
      width="470px"
      height="100vh"
      right={isOpen ? '15rem' : '-15rem'}
      transition="right 0.4s ease-in-out"
      top="0"
      backgroundColor="#f8f9fa"
      zIndex={2}
      overflowY="scroll"
    >
      {children}
    </Box>
  )
}

export default Drawer
