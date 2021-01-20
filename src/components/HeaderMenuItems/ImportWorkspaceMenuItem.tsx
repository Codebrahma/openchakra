import React from 'react'
import { FiUpload } from 'react-icons/fi'
import { useToast, MenuItem, Box } from '@chakra-ui/core'

import useDispatch from '../../hooks/useDispatch'
import loadFonts from '../../utils/loadFonts'
import { loadFromJSON } from '../../utils/import'

const ImportWorkspaceMenuItem = () => {
  const dispatch = useDispatch()
  const toast = useToast()

  const loadFontsOnImport = (fonts: string[]) =>
    loadFonts(fonts, () => onActive(fonts), onInActive)

  const onActive = (fonts: string[]) => dispatch.app.setFonts(fonts)

  const onInActive = () =>
    toast({
      title: 'Error while loading fonts',
      status: 'error',
      duration: 1000,
      isClosable: true,
      position: 'top',
    })

  return (
    <MenuItem
      onClick={async () => {
        const workspace = await loadFromJSON()
        //reset the existing fonts
        dispatch.app.setFonts([])
        dispatch.components.resetAll(workspace.components)
        dispatch.app.setCustomTheme(workspace.theme)
        dispatch.code.resetCodeState(workspace.code)
        workspace.googleFonts.length > 0 &&
          loadFontsOnImport(workspace.googleFonts)
      }}
    >
      <Box mr={2} as={FiUpload} />
      Import workspace
    </MenuItem>
  )
}

export default ImportWorkspaceMenuItem
