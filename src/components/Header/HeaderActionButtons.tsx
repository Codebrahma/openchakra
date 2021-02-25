import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/core'
import { IoMdBuild, IoIosUndo, IoIosRedo } from 'react-icons/io'
import { RiCodeLine } from 'react-icons/ri'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { AiOutlineFullscreen } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { buildParameters } from '../../utils/codesandbox'
import SwitchPageActionButton from '../actionButtons/SwitchPageActionButton'
import ClearOptionPopover from '../ClearOptionPopover'
import {
  getShowLayout,
  getShowCode,
  getLoadedFonts,
} from '../../core/selectors/app'
import { getCode } from '../../core/selectors/code'
import ActionButton from '../actionButtons/ActionButton'
import useDispatch from '../../hooks/useDispatch'
import { checkIsCustomPage, getSelectedPage } from '../../core/selectors/page'

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

const HeaderActionButtons = () => {
  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const isCustomPage = useSelector(checkIsCustomPage)
  const selectedPage = useSelector(getSelectedPage)
  const dispatch = useDispatch()

  return (
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
          {!isCustomPage ? (
            <ClearOptionPopover
              name="Clear Page"
              message="Do you really want to remove all components on the page?"
              onClick={() => {
                dispatch.components.resetComponents()
                dispatch.code.resetPageCode(selectedPage)
              }}
            />
          ) : null}
        </Box>
      </Flex>
    </Flex>
  )
}

export default HeaderActionButtons
