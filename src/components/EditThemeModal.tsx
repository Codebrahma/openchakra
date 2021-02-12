import React, { useState, FunctionComponent, lazy, Suspense } from 'react'
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
  Flex,
} from '@chakra-ui/core'
import useDispatch from '../hooks/useDispatch'
import useCustomTheme from '../hooks/useCustomTheme'
import { useSelector } from 'react-redux'
import { getCustomTheme } from '../core/selectors/app'

const JSONTree = lazy(() => import('react-json-tree'))

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
    reader.onload = async (e) => {
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

  const deleteThemeHandler = () => {
    const deleteConfirmation = window.confirm(
      'Are you sure to clear your custom theme?',
    )

    if (deleteConfirmation) dispatch.app.resetCustomTheme()
  }

  const pasteHandler = (e: any) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
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
        <ModalOverlay>
          <ModalContent rounded={10}>
            <ModalHeader fontSize="15px" textAlign="center">
              View / Edit Theme
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
                      <Suspense fallback={<Box />}>
                        <JSONTree data={theme} theme={jsonTheme} />
                      </Suspense>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Text mb="20px" fontSize="14px">
                      You can edit the custom theme either by uploading the
                      theme file or by directly typing in the editor.
                    </Text>
                    <Input
                      id="themeFile"
                      type="file"
                      accept="application/json"
                      onChange={(selectorFiles: any) =>
                        handleChange(selectorFiles)
                      }
                      fontSize="14px"
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
                      <Box m="30px 0">
                        <Box>
                          <Box
                            bg="rgb(3 22 40)"
                            color="white"
                            fontSize="14px"
                            borderRadius="10px"
                            minHeight="120px"
                            maxHeight="50vh"
                            overflowY="scroll"
                          >
                            <pre
                              id="customTheme"
                              contentEditable={true}
                              style={{
                                display: 'inline-block',
                                width: '100%',
                                whiteSpace: 'pre-wrap',
                                minHeight: '120px',
                              }}
                              suppressContentEditableWarning={true}
                              onPaste={pasteHandler}
                            >
                              {customTheme
                                ? JSON.stringify(customTheme, undefined, 2)
                                : '{ }'}
                            </pre>
                          </Box>
                          <Flex mt="20px" mb="20px">
                            <Button
                              backgroundColor="green.500"
                              color="white"
                              onClick={editThemeHandler}
                            >
                              Save
                            </Button>
                            <Button
                              backgroundColor="white"
                              color="#E12D39"
                              border="1px solid #E12D39"
                              onClick={deleteThemeHandler}
                              ml="10px"
                            >
                              Clear
                            </Button>
                          </Flex>
                          <Text>{saveStatus}</Text>
                          <Box mt="20px" fontSize="12px" color="neutrals.700">
                            <Text>
                              * Don't forget to click the save button to save
                              your changes.
                            </Text>
                            <Text>
                              * Clear button will clears your custom theme
                            </Text>
                          </Box>
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
        </ModalOverlay>
      </Modal>
    </LightMode>
  )
}

export default EditThemeModal
