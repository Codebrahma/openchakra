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
import { ChevronDownIcon } from '@chakra-ui/icons'
import useDispatch from '../../hooks/useDispatch'
import { FaEdit } from 'react-icons/fa'
import { GoRepo } from 'react-icons/go'
import { MdDeleteForever } from 'react-icons/md'
import ImportWorkspaceMenuItem from '../HeaderMenuItems/ImportWorkspaceMenuItem'
import ExportWorkspaceMenuItem from '../HeaderMenuItems/ExportWorkspaceMenuItem'
import SaveWorkspaceMenuItem from '../HeaderMenuItems/SaveWorkspaceMenuItem'
import { useHistory } from 'react-router-dom'

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

const HeaderMenu: FunctionComponent<{ onOpen: any }> = ({ onOpen }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const clearWorkSpaceHandler = () => {
    const confirmClearing = window.confirm(
      'Are you sure to clear your workspace',
    )
    if (confirmClearing) {
      dispatch.code.resetCode()
      dispatch.page.switchPage('app')
      history.push('/app')
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
          <ImportWorkspaceMenuItem />
          <ExportWorkspaceMenuItem />
          <MenuItem onClick={clearWorkSpaceHandler}>
            <Box mr={2} as={MdDeleteForever} />
            Clear workspace
          </MenuItem>

          <MenuItem onClick={onOpen}>
            <Box mr={2} as={FaEdit} />
            Edit/View theme
          </MenuItem>

          <MenuDivider />
          <SaveWorkspaceMenuItem />

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
