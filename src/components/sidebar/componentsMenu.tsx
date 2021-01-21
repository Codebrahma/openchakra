import React, { useState, ChangeEvent, memo } from 'react'
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  LightMode,
} from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'

import DragItem from './DragItem'
import {
  getCustomComponentsList,
  getCustomComponents,
} from '../../core/selectors/components'

type MenuItem = {
  children?: MenuItems
  rootParentType?: ComponentType
}

type MenuItems = Partial<
  {
    [k in ComponentType]: MenuItem
  }
>

export const menuItems: MenuItems = {
  Accordion: {
    children: {
      AccordionItem: {},
      AccordionButton: {},
      AccordionPanel: {},
      AccordionIcon: {},
    },
  },
  Alert: {
    children: {
      AlertDescription: {},
      AlertIcon: {},
      AlertTitle: {},
    },
  },
  AspectRatio: {},
  AvatarGroup: {
    rootParentType: 'Avatar',
  },
  Avatar: {},
  AvatarBadge: {
    rootParentType: 'Avatar',
  },
  Badge: {},
  Box: {},
  Breadcrumb: {
    children: {
      BreadcrumbItem: {},
      BreadcrumbLink: {},
    },
  },
  Button: {},
  Checkbox: {},
  CircularProgress: {},
  CloseButton: {},
  Code: {},
  Divider: {},
  Flex: {},
  FormControl: {
    children: {
      FormLabel: {},
      FormHelperText: {},
    },
  },
  Grid: {},
  Heading: {},
  Icon: {},
  IconButton: {},
  Image: {},
  Input: {},
  InputGroup: {
    rootParentType: 'Input',
    children: {
      Input: {},
      InputLeftAddon: {},
      InputRightAddon: {},
      InputRightElement: {},
      InputLeftElement: {},
    },
  },
  Link: {},
  List: {
    children: {
      ListItem: {},
    },
  },
  Menu: {
    children: {
      MenuList: {},
      MenuButton: {},
      MenuItem: {},
      // MenuGroup: {},
      MenuDivider: {},
      // MenuOptionGroup: {},
      // MenuItemOption: {},
    },
  },
  NumberInput: {
    children: {
      NumberInputStepper: {},
      NumberIncrementStepper: {},
      NumberDecrementStepper: {},
    },
  },
  Progress: {},
  Radio: {},
  RadioGroup: {
    rootParentType: 'Radio',
  },
  SimpleGrid: {},
  Spinner: {},
  Select: {},
  Stack: {},
  Switch: {},
  Tag: {},
  Text: {},
  Textarea: {},
  /*"Tabs",
  "TabList",
  "TabPanel",
  "TabPanels"*/
}

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const customComponentsList = useSelector(getCustomComponentsList)
  const customComponents = useSelector(getCustomComponents)

  return (
    <LightMode>
      <Box
        overflowY="auto"
        overflowX="visible"
        p={5}
        m={0}
        as="menu"
        backgroundColor="white"
        width="15rem"
      >
        <InputGroup size="sm" mb={4}>
          <InputRightElement>
            {searchTerm ? (
              <CloseIcon
                color="neutrals.300"
                cursor="pointer"
                onClick={() => setSearchTerm('')}
              />
            ) : (
              <SearchIcon color="neutrals.300" />
            )}
          </InputRightElement>
          <Input
            value={searchTerm}
            placeholder="Search component…"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
        </InputGroup>

        {(Object.keys(menuItems) as ComponentType[])
          .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(name => {
            const { children } = menuItems[name] as MenuItem

            if (children) {
              const elements = Object.keys(children).map(childName => (
                <DragItem
                  isChild
                  key={childName}
                  label={childName}
                  type={childName as any}
                  id={childName as any}
                  rootParentType={menuItems[name]?.rootParentType || name}
                >
                  {childName}
                </DragItem>
              ))

              return [
                <DragItem
                  isMeta
                  key={`${name}Meta`}
                  label={name}
                  type={`${name}Meta` as any}
                  id={`${name}Meta` as any}
                  rootParentType={menuItems[name]?.rootParentType || name}
                >
                  {name}
                </DragItem>,
                ...elements,
              ]
            }

            return (
              <DragItem
                key={name}
                label={name}
                type={name as any}
                id={name as any}
                rootParentType={menuItems[name]?.rootParentType || name}
              >
                {name}
              </DragItem>
            )
          })}
        {customComponentsList &&
          Object.values(customComponentsList)
            .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(component => {
              const { type, id } = customComponents[component]
              return (
                <DragItem
                  soon={false}
                  key={type}
                  label={component}
                  type={type as any}
                  id={id as any}
                  custom={true}
                >
                  {component}
                </DragItem>
              )
            })}
      </Box>
    </LightMode>
  )
}

export default memo(Menu)
