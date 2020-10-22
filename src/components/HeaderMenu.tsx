import React, { memo, FunctionComponent } from 'react'
import {
  Box,
  Button,
  LightMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  LinkProps,
  MenuItemProps,
  MenuButtonProps,
  ButtonProps,
  useToast,
} from '@chakra-ui/core'
import { ChevronDownIcon } from '@chakra-ui/icons'
import useDispatch from '../hooks/useDispatch'
import { loadFromJSON, saveAsJSON } from '../utils/import'
import { useSelector } from 'react-redux'
import { getState } from '../core/selectors/components'
import { FaSave, FaEdit } from 'react-icons/fa'
import { GoRepo } from 'react-icons/go'
import { FiUpload } from 'react-icons/fi'
import { MdDeleteForever } from 'react-icons/md'
import { getCustomTheme, getLoadedFonts } from '../core/selectors/app'
import loadFonts from '../utils/loadFonts'

type MenuItemLinkProps = MenuItemProps | LinkProps

// Ignore because of AS typing issues
// @ts-ignore
const MenuItemLink: React.FC<MenuItemLinkProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLLinkElement>) => {
    // @ts-ignore
    return <MenuItem ref={ref} as="a" {...props} />
  },
)

// @ts-ignore
const CustomMenuButton: React.FC<
  MenuButtonProps | ButtonProps
> = React.forwardRef((props, ref: React.Ref<HTMLLinkElement>) => {
  // @ts-ignore
  return <MenuButton as={Button} {...props} />
})

const ExportMenuItem = () => {
  const componentsState = useSelector(getState)
  const theme = useSelector(getCustomTheme)
  const googleFonts = useSelector(getLoadedFonts)

  return (
    <MenuItem
      onClick={() =>
        saveAsJSON({ components: componentsState, theme, googleFonts })
      }
    >
      <Box mr={2} as={FaSave} />
      Save workspace
    </MenuItem>
  )
}

const HeaderMenu: FunctionComponent<{ onOpen: any }> = ({ onOpen }) => {
  const dispatch = useDispatch()
  const toast = useToast()

  const loadFontsOnImport = (fonts: string[]) => {
    const onActive = () => {
      dispatch.app.setFonts(fonts)
    }
    const onInActive = () => {
      toast({
        title: 'Error while loading fonts',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'top',
      })
    }

    if (fonts.length > 0) loadFonts(fonts, onActive, onInActive)
    else dispatch.app.setFonts([])
  }

  const clearWorkSpaceHandler = () => {
    const confirmClearing = window.confirm(
      'Are you sure to clear your workspace',
    )
    if (confirmClearing) {
      dispatch.components.resetAll()
      dispatch.app.resetCustomTheme()
      dispatch.app.removeAllFonts()
    }
  }

  return (
    <Menu>
      <CustomMenuButton
        rightIcon={<ChevronDownIcon />}
        size="sm"
        variant="ghost"
        colorScheme="gray"
      >
        Workspace
      </CustomMenuButton>
      <LightMode>
        <MenuList zIndex={5000}>
          <ExportMenuItem />
          <MenuItem
            onClick={async () => {
              const workspace = await loadFromJSON()
              dispatch.components.resetAll(workspace.components)
              dispatch.app.setCustomTheme(workspace.theme)
              loadFontsOnImport(workspace.fonts)
            }}
          >
            <Box mr={2} as={FiUpload} />
            Import workspace
          </MenuItem>
          <MenuItem onClick={clearWorkSpaceHandler}>
            <Box mr={2} as={MdDeleteForever} />
            Clear workspace
          </MenuItem>

          <MenuItem onClick={onOpen}>
            <Box mr={2} as={FaEdit} />
            Edit/View theme
          </MenuItem>

          <MenuDivider />

          <MenuItemLink href="https://chakra-ui.com/getting-started">
            <Box mr={2} as={GoRepo} />
            Chakra UI Docs
          </MenuItemLink>
        </MenuList>
      </LightMode>
    </Menu>
  )
}

export default memo(HeaderMenu)
