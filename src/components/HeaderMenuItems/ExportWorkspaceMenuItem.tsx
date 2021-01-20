import React from 'react'
import { useSelector } from 'react-redux'
import { MenuItem, Box } from '@chakra-ui/core'
import { TiExport } from 'react-icons/ti'

import { getLoadedFonts, getCustomTheme } from '../../core/selectors/app'
import { getState } from '../../core/selectors/components'
import { saveAsJSON } from '../../utils/import'
import { getCodeState } from '../../core/selectors/code'

const ExportWorkspaceMenuItem = () => {
  const componentsState = useSelector(getState)
  const theme = useSelector(getCustomTheme)
  const googleFonts = useSelector(getLoadedFonts)
  const code = useSelector(getCodeState)

  return (
    <MenuItem
      onClick={() =>
        saveAsJSON({ components: componentsState, theme, googleFonts, code })
      }
    >
      <Box mr={2} as={TiExport} />
      Export workspace
    </MenuItem>
  )
}

export default ExportWorkspaceMenuItem
