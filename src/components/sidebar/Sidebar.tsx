import React, { useEffect } from 'react'
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/core'

import Inspector from '../inspector/Inspector'
import ComponentsMenu from './componentsMenu'
import { InspectorProvider } from '../../contexts/inspector-context'
import { AiOutlineAppstore } from 'react-icons/ai'
import { FaPaintBrush } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { getSelectedComponentId } from '../../core/selectors/components'
import ReadyMadeComponents from './ReadyMadeComponents'

const Sidebar = () => {
  const selectedId = useSelector(getSelectedComponentId)

  const [tabIndex, setTabIndex] = React.useState(0)

  const handleTabsChange = (index: number) => setTabIndex(index)

  useEffect(() => {
    setTabIndex(1)
  }, [selectedId])
  return (
    <Box
      height="100vh"
      flex="0 0 15rem"
      bg="white"
      overflowY="auto"
      overflowX="visible"
      borderLeft="1px solid #cad5de"
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
            <ReadyMadeComponents />
          </TabPanel>
          <TabPanel p={0}>
            <InspectorProvider>
              <Inspector />
            </InspectorProvider>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Sidebar
