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
  useTheme,
} from '@chakra-ui/core'
import JSONTree from 'react-json-tree'
import { useSelector } from 'react-redux'
import merge from '../utils/mergeObject'
import { getCustomTheme } from '../core/selectors/app'
import useDispatch from '../hooks/useDispatch'

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
  const customTheme = useSelector(getCustomTheme)
  const theme = useTheme()
  const dispatch = useDispatch()

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

  return (
    <LightMode>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent rounded={10}>
          <ModalHeader fontSize="15px" textAlign="center">
            Add your custom JSON Theme Object
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              id="themeFile"
              type="file"
              accept="application/json"
              onChange={(selectorFiles: any) => handleChange(selectorFiles)}
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
            <Box rounded={5}>
              <JSONTree
                data={customTheme ? merge(theme, customTheme) : { ...theme }}
                theme={jsonTheme}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} size="sm">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LightMode>
  )
}

export default EditThemeModal
