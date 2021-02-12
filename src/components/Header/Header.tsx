import React, { memo, Suspense, lazy } from 'react'
import { Box, Flex, useDisclosure, Image } from '@chakra-ui/core'

import composerIcon from '../../images/composer-icon.png'

const HeaderMenu = lazy(() => import('./HeaderMenu'))
const EditThemeModal = lazy(() => import('../EditThemeModal'))
const HeaderActionButtons = lazy(() => import('./HeaderActionButtons'))

const Header = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Flex
      justifyContent="space-between"
      as="header"
      height="3rem"
      px="1rem"
      borderBottom="1px solid rgb(225, 230, 235)"
      bg="white"
      pr={1}
      width="100%"
      alignItems="center"
    >
      <Box>
        <Suspense fallback={<Box />}>
          <HeaderMenu onOpen={onOpen} />
        </Suspense>
        <Suspense fallback={<Box />}>
          <EditThemeModal isOpen={isOpen} onClose={onClose} />
        </Suspense>
      </Box>
      <Flex
        width="14rem"
        height="100%"
        backgroundColor="white"
        color="white"
        as="a"
        fontSize="xl"
        flexDirection="row"
        alignItems="center"
        flex={1}
        justifyContent="center"
        ml="12%"
      >
        <Image
          src={composerIcon}
          mr="0.5rem"
          width="30px"
          height="25px"
          alt="Composer Icon"
        />
        <Box fontWeight="bold" color="black">
          Composer
        </Box>
      </Flex>
      <Suspense fallback={<Box />}>
        <HeaderActionButtons />
      </Suspense>
    </Flex>
  )
}

export default memo(Header)
