import React from 'react'
import { Box, Text, Image, Flex } from '@chakra-ui/core'

import blog1Image from '../../images/components-image/blog1.png'
import blog2Image from '../../images/components-image/blog2.png'
import ECommerce1Image from '../../images/components-image/ECommerce1.png'
import ECommerce2Image from '../../images/components-image/ECommerce2.png'
import Pricing1Image from '../../images/components-image/Pricing1.png'
import Team1Image from '../../images/components-image/team1.png'
import DragImage from './DragImage'

const ReadyMadeComponents = () => {
  const components = {
    blogs: [
      { name: 'Blog1', image: blog1Image },
      { name: 'Blog2', image: blog2Image },
      { name: 'ECommerce1', image: ECommerce1Image },
      { name: 'ECommerce2', image: ECommerce2Image },
      { name: 'Pricing1', image: Pricing1Image },
      { name: 'Team1', image: Team1Image },
    ],
  }
  return (
    <Box p={2}>
      <Text color="neutrals.500" mb={2} mt={5} fontSize="sm">
        Ready components
      </Text>
      <Flex flexDirection="column" alignItems="center">
        {components.blogs.map(blog => {
          return (
            <DragImage type={blog.name} key={blog.name}>
              <Image src={blog.image} width="100%" height="100px" />
            </DragImage>
          )
        })}
      </Flex>
    </Box>
  )
}

export default ReadyMadeComponents
