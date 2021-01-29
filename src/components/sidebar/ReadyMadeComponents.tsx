import React from 'react'
import { Box, Text, Image, Flex } from '@chakra-ui/core'

import blog1Image from '../../images/components-image/blog1.png'
import DragImage from './DragImage'

const ReadyMadeComponents = () => {
  const components = {
    blogs: [{ name: 'Blog1', image: blog1Image }],
  }
  return (
    <Box p={2}>
      <Text color="neutrals.500" mb={2} mt={5} fontSize="sm">
        BLOGS
      </Text>
      <Flex flexDirection="column" alignItems="center">
        {components.blogs.map(blog => {
          return (
            <DragImage type={blog.name}>
              <Image src={blog.image} />
            </DragImage>
          )
        })}
      </Flex>
    </Box>
  )
}

export default ReadyMadeComponents
