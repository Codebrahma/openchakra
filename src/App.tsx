import React from 'react'
import { Flex, Box, ThemeProvider, IconButton } from '@chakra-ui/core'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useSelector } from 'react-redux'
import Editor from './components/editor/Editor'
import Header from './components/Header'
import { Global } from '@emotion/core'
import { ArrowBackIcon } from '@chakra-ui/icons'
// import EditorErrorBoundary from './components/errorBoundaries/EditorErrorBoundary'
import {
  getShowFullScreen,
  getLoadedFonts,
  getShowCode,
} from './core/selectors/app'
import useDispatch from './hooks/useDispatch'
import loadFonts from './utils/loadFonts'
import useCustomTheme from './hooks/useCustomTheme'
import CodePanel from './components/CodePanel'
import Sidebar from './components/sidebar/Sidebar'
import useShortCutKeys from './hooks/useShortcutKeys'

const App = () => {
  const showFullScreen = useSelector(getShowFullScreen)
  const dispatch = useDispatch()
  const theme = useCustomTheme()
  const showCode = useSelector(getShowCode)

  const loadedFonts = useSelector(getLoadedFonts)
  loadedFonts && loadFonts(loadedFonts)

  useShortCutKeys()

  return (
    <Box>
      <Global
        styles={() => ({
          html: { minWidth: '860px', backgroundColor: '#1a202c' },
        })}
      />
      {showFullScreen ? (
        <Box bg="neutrals.900" zIndex={500} width="100%">
          <IconButton
            icon={<ArrowBackIcon />}
            variant="solid"
            onClick={() => dispatch.app.toggleFullScreen()}
            aria-label="go-back"
            size="xs"
          />
        </Box>
      ) : null}
      <DndProvider backend={Backend}>
        <Flex width="100%">
          <Box flex={1}>
            {!showFullScreen ? <Header /> : null}

            <ThemeProvider theme={theme}>
              {/* <EditorErrorBoundary> */}

              <Box
                bg="white"
                height={!showFullScreen ? 'calc(100vh - 3rem)' : '100vh'}
              >
                {showCode ? <CodePanel /> : <Editor />}
              </Box>
              {/* </EditorErrorBoundary> */}
            </ThemeProvider>
          </Box>

          {!showFullScreen ? <Sidebar /> : null}
        </Flex>
      </DndProvider>
    </Box>
  )
}

export default App
