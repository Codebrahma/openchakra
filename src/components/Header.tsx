import React, { memo, useState } from 'react'
import {
  Box,
  Switch,
  Button,
  Flex,
  Stack,
  FormLabel,
  FormControl,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/core'
import { AiFillThunderbolt, AiOutlineFullscreen } from 'react-icons/ai'
import { buildParameters } from '../utils/codesandbox'
import { generateCode } from '../utils/code'
import useDispatch from '../hooks/useDispatch'
import { useSelector } from 'react-redux'
import {
  getComponents,
  getCustomComponents,
  getCustomComponentsList,
  getShowCustomComponentPage,
  getProps,
  getCustomComponentsProps,
} from '../core/selectors/components'
import {
  getShowLayout,
  getShowCode,
  getCustomTheme,
  getLoadedFonts,
} from '../core/selectors/app'
import HeaderMenu from './HeaderMenu'
import ClearOptionPopover from './ClearOptionPopover'
import EditThemeModal from './EditThemeModal'

const CodeSandboxButton = () => {
  const components = useSelector(getComponents)
  const customComponents = useSelector(getCustomComponents)
  const customComponentsList = useSelector(getCustomComponentsList)
  const props = useSelector(getProps)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const [isLoading, setIsLoading] = useState(false)
  const customTheme = useSelector(getCustomTheme)
  const fonts = useSelector(getLoadedFonts)

  return (
    <Tooltip
      zIndex={100}
      hasArrow
      bg="neutrals.700"
      aria-label="Builder mode help"
      label="Export in CodeSandbox"
    >
      <Button
        onClick={async () => {
          setIsLoading(true)
          const code = await generateCode(
            components,
            customComponents,
            customComponentsList,
            props,
            customComponentsProps,
            customTheme,
          )
          setIsLoading(false)
          const parameters = buildParameters(code, fonts)

          window.open(
            `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
            '_blank',
          )
        }}
        isLoading={isLoading}
        rightIcon="external-link"
        variant="ghost"
        size="xs"
      >
        Export code
      </Button>
    </Tooltip>
  )
}

const Header = () => {
  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const showCustomPage = useSelector(getShowCustomComponentPage)
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
    >
      <Flex
        width="14rem"
        height="100%"
        backgroundColor="white"
        color="white"
        as="a"
        fontSize="xl"
        flexDirection="row"
        alignItems="center"
        aria-label="Chakra UI, Back to homepage"
      >
        <Box fontSize="2xl" as={AiFillThunderbolt} mr={1} color="primary.100" />{' '}
        <Box fontWeight="bold" color="black">
          Assembler
        </Box>
      </Flex>

      <Flex flexGrow={1} justifyContent="space-between" alignItems="center">
        <Stack isInline spacing={4} justify="center" align="center">
          <Box>
            <HeaderMenu onOpen={onOpen} />
            <EditThemeModal isOpen={isOpen} onClose={onClose} />
          </Box>
          <FormControl>
            <Tooltip
              zIndex={100}
              hasArrow
              bg="neutrals.700"
              aria-label="Builder mode help"
              label="Builder mode adds extra padding/borders"
            >
              <FormLabel
                cursor="help"
                color="black"
                fontSize="xs"
                htmlFor="preview"
                pb={0}
              >
                Builder mode
              </FormLabel>
            </Tooltip>
            <Switch
              isChecked={showLayout}
              color="primary"
              size="sm"
              onChange={() => dispatch.app.toggleBuilderMode()}
              id="preview"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="black" fontSize="xs" htmlFor="code" pb={0}>
              Code panel
            </FormLabel>
            <Switch
              isChecked={showCode}
              id="code"
              color="primary"
              onChange={() => dispatch.app.toggleCodePanel()}
              size="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel
              color="black"
              fontSize="xs"
              htmlFor="customComponents"
              pb={0}
            >
              Custom Components
            </FormLabel>
            <Switch
              isChecked={showCustomPage}
              id="customComponents"
              color="primary"
              onChange={() => {
                dispatch.components.unselect()
                if (showCustomPage) dispatch.components.switchPage('app')
                else dispatch.components.switchPage('customPage')
              }}
              size="sm"
            />
          </FormControl>
        </Stack>

        <Stack isInline>
          <Button
            rightIcon={AiOutlineFullscreen}
            variant="ghost"
            size="xs"
            onClick={() => dispatch.app.toggleFullScreen()}
          >
            Full Screen
          </Button>
          <CodeSandboxButton />

          <ClearOptionPopover
            name="Clear Theme"
            message="Do you really want to remove the custom theme on the
                  editor?"
            dispatchAction={() => dispatch.app.resetCustomTheme()}
          />
          <ClearOptionPopover
            name="Clear Page"
            message="Do you really want to remove all components on the page?"
            dispatchAction={() => dispatch.components.resetComponents()}
          />
          <ClearOptionPopover
            name="Clear All"
            message="Do you really want to remove everything?"
            dispatchAction={() => dispatch.components.resetAll()}
          />
        </Stack>
      </Flex>
    </Flex>
  )
}

export default memo(Header)
