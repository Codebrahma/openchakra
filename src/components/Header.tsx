import React, { memo, useState } from 'react'
import { Box, Flex, useDisclosure, Image } from '@chakra-ui/core'
import { AiOutlineFullscreen } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { IoMdBuild, IoIosUndo, IoIosRedo } from 'react-icons/io'
import { RiCodeLine } from 'react-icons/ri'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { buildParameters } from '../utils/codesandbox'
import useDispatch from '../hooks/useDispatch'
import {
  getShowLayout,
  getShowCode,
  getLoadedFonts,
} from '../core/selectors/app'
import HeaderMenu from './HeaderMenu'
import ClearOptionPopover from './ClearOptionPopover'
import EditThemeModal from './EditThemeModal'
import ActionButton from './actionButtons/ActionButton'
import composerIcon from '../composer-icon.png'
import { getCode } from '../core/selectors/code'
import SwitchPageActionButton from './actionButtons/SwitchPageActionButton'

const CodeSandboxButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const fonts = useSelector(getLoadedFonts)
  const code = useSelector(getCode)

  const clickHandler = async () => {
    setIsLoading(true)

    setIsLoading(false)
    const parameters = buildParameters(code, fonts)

    window.open(
      `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
      '_blank',
    )
  }

  return (
    <ActionButton
      label="Export to codesandbox"
      icon={<ExternalLinkIcon />}
      onClick={clickHandler}
      isLoading={isLoading}
      size="sm"
      color="black"
    />
  )
}

const Header = () => {
  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const dispatch = useDispatch()
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
        <HeaderMenu onOpen={onOpen} />
        <EditThemeModal isOpen={isOpen} onClose={onClose} />
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
        <Image src={composerIcon} mr="0.5rem" w="30px" h="25px" />
        <Box fontWeight="bold" color="black">
          Composer
        </Box>
      </Flex>

      <Flex>
        <Flex border="1px solid #9FB3C8" mr={4} alignItems="center">
          <Box borderRight="1px solid #9FB3C8">
            <SwitchPageActionButton />
          </Box>
          <Box borderRight="1px solid #9FB3C8">
            <ActionButton
              label="Code"
              icon={<RiCodeLine />}
              onClick={() => {
                dispatch.components.unselect()
                dispatch.app.toggleCodePanel()
              }}
              bg={showCode ? 'primary.100' : 'white'}
              color={showCode ? 'primary.900' : 'black'}
              size="sm"
            />
          </Box>

          <Box>
            <ActionButton
              label="Builder Mode"
              icon={<IoMdBuild />}
              onClick={() => dispatch.app.toggleBuilderMode()}
              bg={showLayout ? 'primary.100' : 'white'}
              color={showLayout ? 'primary.900' : 'black'}
              size="sm"
            />
          </Box>
        </Flex>
        <Flex border="1px solid #9FB3C8" mr={2} alignItems="center">
          <Box borderRight="1px solid #9FB3C8">
            <ActionButton
              label="fullScreen"
              icon={<AiOutlineFullscreen />}
              onClick={() => dispatch.app.toggleFullScreen()}
              color="black"
              size="sm"
            />
          </Box>
          <Box borderRight="1px solid #9FB3C8">
            <ActionButton
              label="Undo"
              icon={<IoIosUndo />}
              onClick={() => dispatch(UndoActionCreators.undo())}
              size="sm"
            />
          </Box>
          <Box borderRight="1px solid #9FB3C8">
            <ActionButton
              label="Redo"
              icon={<IoIosRedo />}
              onClick={() => dispatch(UndoActionCreators.redo())}
              size="sm"
            />
          </Box>

          <Box borderRight="1px solid #9FB3C8">
            <CodeSandboxButton />
          </Box>

          <Box>
            <ClearOptionPopover
              name="Clear Page"
              message="Do you really want to remove all components on the page?"
              dispatchAction={() => dispatch.components.resetComponents()}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default memo(Header)
