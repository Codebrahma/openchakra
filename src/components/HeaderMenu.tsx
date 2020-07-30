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
} from '@chakra-ui/core'
import useDispatch from '../hooks/useDispatch'
import { loadFromJSON, saveAsJSON } from '../utils/import'
import { useSelector } from 'react-redux'
import { getState } from '../core/selectors/components'
import { FaBomb, FaSave, FaEdit } from 'react-icons/fa'
import { GoRepo } from 'react-icons/go'
import { FiUpload } from 'react-icons/fi'

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
  const state = useSelector(getState)

  return (
    <MenuItem onClick={() => saveAsJSON(state)}>
      <Box mr={2} as={FaSave} />
      Save workspace
    </MenuItem>
  )
}
const HeaderMenu: FunctionComponent<{ onOpen: any }> = ({ onOpen }) => {
  const dispatch = useDispatch()

  return (
    <Menu>
      <CustomMenuButton
        rightIcon="chevron-down"
        as={Button}
        size="xs"
        variant="ghost"
        variantColor="gray"
      >
        Editor
      </CustomMenuButton>
      <LightMode>
        <MenuList zIndex={100}>
          <ExportMenuItem />
          <MenuItem
            onClick={async () => {
              const state = await loadFromJSON()
              dispatch.components.resetAll(state)
            }}
          >
            <Box mr={2} as={FiUpload} />
            Import workspace
          </MenuItem>
          <MenuItem onClick={onOpen}>
            <Box mr={2} as={FaEdit} />
            Edit theme
          </MenuItem>

          <MenuDivider />

          <MenuItemLink isExternal href="https://chakra-ui.com/getting-started">
            <Box mr={2} as={GoRepo} />
            Chakra UI Docs
          </MenuItemLink>
          <MenuItemLink href="https://github.com/premieroctet/openchakra/issues">
            <Box mr={2} as={FaBomb} />
            Report issue
          </MenuItemLink>
        </MenuList>
      </LightMode>
    </Menu>
  )
}

export default memo(HeaderMenu)
