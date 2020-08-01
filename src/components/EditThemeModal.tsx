import React, { useState, FunctionComponent } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  ModalHeader,
  LightMode,
  Box,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/core'
import JSONTree from 'react-json-tree'
import useDispatch from '../hooks/useDispatch'
import useCustomTheme from '../hooks/useCustomTheme'
import { useSelector } from 'react-redux'
import { getCustomTheme } from '../core/selectors/app'

export const jsonTheme = {
  scheme: 'google',
  author: 'seth wright (http://sethawright.com)',
  base00: '#000',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',
}
const EditThemeModal: FunctionComponent<{
  isOpen: boolean
  onClose: any
}> = ({ isOpen, onClose }) => {
  const [fileLoaded, setFileLoaded] = useState(false)
  const [fileError, setFileError] = useState(false)
  const theme = useCustomTheme()
  const customTheme = useSelector(getCustomTheme)
  const dispatch = useDispatch()
  const [saveStatus, changeSaveStatus] = useState('')

  const handleChange = async (selectorFiles: any) => {
    selectorFiles.preventDefault()
    const reader = new FileReader()
    reader.onload = async e => {
      if (e.target!.result) {
        const text = e.target!.result
        // @ts-ignore
        dispatch.app.setCustomTheme(JSON.parse(text))
        setFileLoaded(true)
      } else {
        setFileError(true)
      }
    }
    reader.readAsText(selectorFiles.target.files[0])
  }
  const editThemeHandler = () => {
    const data = document.getElementById('customTheme')?.innerHTML
    if (data) {
      try {
        dispatch.app.setCustomTheme(JSON.parse(data))
        changeSaveStatus('✅ Changes had been saved successfully.')
      } catch (e) {
        changeSaveStatus('❌ Error in JSON data')
      }
    } else {
      changeSaveStatus('❌ You can not leave the editor empty.')
    }
  }

  return (
    <LightMode>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          changeSaveStatus('')
          onClose()
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent rounded={10}>
          <ModalHeader fontSize="15px" textAlign="center">
            Add your custom JSON Theme Object
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>View Theme</Tab>
                <Tab>Edit Theme</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box rounded={5}>
                    <JSONTree data={theme} theme={jsonTheme} />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Text mb="20px">
                    You can edit the custom theme by uploading the theme file or
                    by directly typing in the editor.
                  </Text>
                  <Input
                    id="themeFile"
                    type="file"
                    accept="application/json"
                    onChange={(selectorFiles: any) =>
                      handleChange(selectorFiles)
                    }
                  />

                  {fileLoaded && (
                    <div>
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Your theme has been successfully loaded{' '}
                        <span
                          style={{ verticalAlign: 'middle' }}
                          role="img"
                          aria-label="light"
                        >
                          ✅
                        </span>
                      </p>
                    </div>
                  )}

                  {fileError && (
                    <p>
                      Can't read this file / theme{' '}
                      <span
                        style={{ verticalAlign: 'middle' }}
                        role="img"
                        aria-label="light"
                      >
                        ❌
                      </span>
                    </p>
                  )}
                  <Box>
                    <Box m="20px 0">
                      <Box>
                        <Box mb="20px">
                          <Text>
                            Don't forget to click the save button to save your
                            changes.
                          </Text>
                        </Box>
                        <Box
                          bg="rgb(3 22 40)"
                          color="white"
                          fontSize="14px"
                          borderRadius="10px"
                          minHeight="100px"
                        >
                          <pre
                            id="customTheme"
                            contentEditable={true}
                            style={{
                              display: 'inline-block',
                              minHeight: '100px',
                              width: '100%',
                            }}
                            suppressContentEditableWarning={true}
                          >
                            {customTheme
                              ? JSON.stringify(customTheme, undefined, 2)
                              : '{ }'}
                          </pre>
                        </Box>
                        <Button
                          backgroundColor="#2e3748"
                          color="white"
                          onClick={editThemeHandler}
                          mt="20px"
                          mb="20px"
                        >
                          Save Theme
                        </Button>
                        <Text>{saveStatus}</Text>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                changeSaveStatus('')
                onClose()
              }}
              size="sm"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default EditThemeModal
