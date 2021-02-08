import React, { useEffect, useState, ChangeEvent } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
} from '@chakra-ui/core'
import { SearchIcon, CloseIcon } from '@chakra-ui/icons'
import { AiOutlineAppstore } from 'react-icons/ai'
import { FaPaintBrush } from 'react-icons/fa'
import { useSelector } from 'react-redux'

import Inspector from '../inspector/Inspector'
import { InspectorProvider } from '../../contexts/inspector-context'
import {
  getSelectedComponentId,
  getCustomComponentsList,
} from '../../core/selectors/components'
import componentMenuItems, {
  IMenuItem,
  IMenuComponent,
  IMenuItems,
} from './SidebarMenuItems'
import Backdrop from './Backdrop'
import Drawer from './Drawer'
import MenuItemComponents from './MenuItemComponents'

const Sidebar = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedMenuItem, setSelectedMenuItem] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selectedId = useSelector(getSelectedComponentId)
  const customComponentsList = useSelector(getCustomComponentsList)

  const userComponentsMenuItem: IMenuItem = {
    name: 'User Components',
    components: customComponentsList.map(
      (customComponentName): IMenuComponent => {
        return {
          name: customComponentName,
          label: customComponentName,
          custom: true,
        }
      },
    ),
  }
  const menuItems: IMenuItems = {
    ...componentMenuItems,
    UserComponents: userComponentsMenuItem,
  }

  const onHover = (menuItem: string) => {
    setIsOpen(true)
    setSelectedMenuItem(menuItem)
  }

  const closeDrawerHandler = () => {
    if (isOpen) setIsOpen(false)
  }

  const onDrag = (isDragging: boolean) => {
    if (isDragging) {
      setSearchTerm('')
      closeDrawerHandler()
    }
  }

  const handleTabsChange = (index: number) => setTabIndex(index)

  useEffect(() => {
    setTabIndex(1)
  }, [selectedId])

  const getFilteredMenuItem = () => {
    let matchedMenuItem: string = ''
    let componentIndex: number = -1

    // Find wether the searched components matches any other items in the list
    Object.keys(menuItems).forEach(menuItemName => {
      const itemIndex = menuItems[menuItemName].components.findIndex(
        component => component.name.toLowerCase() === searchTerm.toLowerCase(),
      )

      if (itemIndex !== -1) {
        matchedMenuItem = menuItemName
        componentIndex = itemIndex
      }
    })

    // If the component is found, return the filtered component or else return all the components of the menu-item
    if (componentIndex !== -1) {
      if (matchedMenuItem !== selectedMenuItem) {
        setSelectedMenuItem(matchedMenuItem)
      }

      if (!isOpen) setIsOpen(true)

      return {
        name: matchedMenuItem,
        components: [
          { ...menuItems[matchedMenuItem].components[componentIndex] },
        ],
      }
    } else {
      return menuItems[selectedMenuItem]
    }
  }

  const menuItemToRender: IMenuItem =
    searchTerm.length > 0 ? getFilteredMenuItem() : menuItems[selectedMenuItem]

  return (
    <Box position="relative" width="15rem">
      <Box
        width="15rem"
        bg="white"
        overflowY="scroll"
        height="100vh"
        borderLeft="1px solid #cad5de"
        zIndex={3}
        position="absolute"
      >
        <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab
              _selected={{
                color: 'primary.800',
                bg: 'primary.100',
              }}
              _focus={{
                shadow: 'none',
              }}
            >
              <Box as={AiOutlineAppstore} fontSize="25px" height="30px" />
            </Tab>
            <Tab
              _selected={{
                color: 'primary.800',
                bg: 'primary.100',
              }}
              _focus={{
                shadow: 'none',
              }}
            >
              <Box as={FaPaintBrush} fontSize="20px" height="30px" />
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <Box onMouseLeave={() => setIsOpen(false)}>
                <InputGroup size="sm" m={4} width="90%">
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
                {Object.keys(menuItems).map(key => {
                  const { name } = menuItems[key]
                  return (
                    <Box
                      p={2}
                      mb={2}
                      key={key}
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.100',
                        shadow: 'sm',
                      }}
                      bg={
                        selectedMenuItem === key && isOpen
                          ? 'gray.100'
                          : 'white'
                      }
                      onMouseEnter={() => onHover(key)}
                    >
                      {name}
                    </Box>
                  )
                })}
              </Box>
            </TabPanel>
            <TabPanel p={0}>
              <InspectorProvider>
                <Inspector />
              </InspectorProvider>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={closeDrawerHandler}
      >
        <Drawer isOpen={isOpen}>
          {menuItemToRender && menuItemToRender.components.length > 0 ? (
            <MenuItemComponents
              components={menuItemToRender.components}
              onDrag={onDrag}
            />
          ) : (
            <Flex height="100%" alignItems="center" justifyContent="center">
              <Text color="gray.500" fontWeight="700">
                Sorry. No components found here
              </Text>
            </Flex>
          )}
        </Drawer>
      </Box>
      <Backdrop showBackdrop={isOpen} />
    </Box>
  )
}

export default Sidebar
