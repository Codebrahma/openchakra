import React, { useState, ChangeEvent, memo } from 'react'
import {
  Box,
  Input,
  InputGroup,
  Icon,
  InputRightElement,
  LightMode,
} from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import DragItem from './DragItem'
import {
  getCustomComponentsList,
  getCustomComponents,
} from '../../core/selectors/components'

type MenuItem = {
  children?: MenuItems
  soon?: boolean
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
      Accordion: {},
      AccordionItem: {},
      AccordionHeader: {},
      AccordionPanel: {},
      AccordionIcon: {},
    },
  },
  Alert: {
    children: {
      Alert: {},
      AlertDescription: {},
      AlertIcon: {},
      AlertTitle: {},
    },
  },
  AspectRatioBox: {},
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
      FormControl: {},
      FormLabel: {},
      FormHelperText: {},
      FormErrorMessage: {},
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
      InputGroup: {},
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
      List: {},
      ListItem: {},
    },
  },
  Menu: {
    children: {
      Menu: {},
      MenuList: {},
      MenuButton: {},
      MenuItem: {},
      // MenuGroup: {},
      MenuDivider: {},
      // MenuOptionGroup: {},
      // MenuItemOption: {},
    },
  },
  NumberInput: {},
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
              <Icon
                color="neutrals.300"
                name="close"
                cursor="pointer"
                onClick={() => setSearchTerm('')}
              >
                x
              </Icon>
            ) : (
              <Icon name="search" color="neutrals.300" />
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
            const { children, soon } = menuItems[name] as MenuItem

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
                  soon={soon}
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
                soon={soon}
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
