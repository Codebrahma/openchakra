import React from 'react'
import { useSelector } from 'react-redux'
import { MenuItem, Box } from '@chakra-ui/core'
import { FaSave } from 'react-icons/fa'

import { getPageCode, getAllComponentsCode } from '../../core/selectors/code'
import { getLoadedFonts, getCustomTheme } from '../../core/selectors/app'
import { saveAsZip } from '../../utils/import'

const SaveWorkspaceMenuItem = () => {
  const appCode = useSelector(getPageCode('app'))
  const componentsCode = useSelector(getAllComponentsCode)
  const fonts = useSelector(getLoadedFonts)
  const customTheme = useSelector(getCustomTheme)

  return (
    <MenuItem
      onClick={() => saveAsZip({ appCode, componentsCode, fonts, customTheme })}
    >
      <Box mr={2} as={FaSave} />
      Save as project
    </MenuItem>
  )
}

export default SaveWorkspaceMenuItem
