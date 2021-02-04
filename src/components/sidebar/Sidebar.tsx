import React, { useEffect, useState } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Text,
} from '@chakra-ui/core'
import Drawer from './Drawer'
import DragItem from './DragItem'

import Inspector from '../inspector/Inspector'
import { InspectorProvider } from '../../contexts/inspector-context'
import { AiOutlineAppstore } from 'react-icons/ai'
import { FaPaintBrush } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { getSelectedComponentId } from '../../core/selectors/components'
import menuItems from './SidebarMenuItems'
import Backdrop from './Backdrop'
import DragImage from './DragImage'

const Sidebar = () => {
  const selectedId = useSelector(getSelectedComponentId)

  const [tabIndex, setTabIndex] = React.useState(0)
  const [selectedMenuItem, setSelectedMenuItem] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const onHover = (menuItem: string) => {
    setIsOpen(true)
    setSelectedMenuItem(menuItem)
  }

  const closeDrawerHandler = () => {
    if (isOpen) setIsOpen(false)
    setSelectedMenuItem('')
  }

  const onDrag = (isDragging: boolean) => {
    if (isDragging) {
      closeDrawerHandler()
    }
  }

  const handleTabsChange = (index: number) => setTabIndex(index)

  useEffect(() => {
    setTabIndex(1)
  }, [selectedId])

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
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight={700}
                  mb={3}
                  mt={5}
                  pl="1.5rem"
                >
                  COMPONENTS
                </Text>
                {Object.keys(menuItems).map(itemName => {
                  return (
                    <Box
                      p={2}
                      pl="1.5rem"
                      mb={2}
                      key={itemName}
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.100',
                        shadow: 'sm',
                      }}
                      bg={
                        selectedMenuItem === itemName && isOpen
                          ? 'gray.100'
                          : 'white'
                      }
                      onMouseEnter={() => onHover(itemName)}
                    >
                      {itemName}
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
          {menuItems[selectedMenuItem]?.components.map(component => {
            if (component.image) {
              return (
                <DragImage
                  key={component.name}
                  type={component.name}
                  onDrag={onDrag}
                >
                  <Image src={component.image} borderRadius="md" />
                </DragImage>
              )
            }
            return (
              <DragItem
                key={component.name}
                label={component.name}
                type={component.name as any}
                id={component.name as any}
                onDrag={onDrag}
              >
                {component.name}
              </DragItem>
            )
          })}
        </Drawer>
      </Box>
      <Backdrop showBackdrop={isOpen} />
    </Box>
  )
}

export default Sidebar
