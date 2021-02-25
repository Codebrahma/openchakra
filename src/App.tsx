import React, { Suspense, lazy } from 'react'
import { Flex, Box, ThemeProvider, IconButton } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
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
import useShortCutKeys from './hooks/useShortcutKeys'
import EditorRouting from './components/editor/EditorRouting'
import Header from './components/Header/Header'
import Sidebar from './components/sidebar/Sidebar'

const CodePanel = lazy(() => import('./components/CodePanel'))

const App = () => {
  const showFullScreen = useSelector(getShowFullScreen)
  const dispatch = useDispatch()
  const theme = useCustomTheme()
  const showCode = useSelector(getShowCode)

  const loadedFonts = useSelector(getLoadedFonts)
  loadedFonts.length > 0 && loadFonts(loadedFonts)

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

      <Flex width="100%" overflowX="hidden">
        <Box flex={1}>
          {!showFullScreen ? <Header /> : null}

          <ThemeProvider theme={theme}>
            {/* <EditorErrorBoundary> */}

            <Box
              bg="white"
              height={!showFullScreen ? 'calc(100vh - 3rem)' : '100vh'}
              width={!showFullScreen ? 'calc(100vw - 15rem)' : '100vw'}
            >
              {showCode ? (
                <Suspense fallback={<Box />}>
                  <CodePanel />{' '}
                </Suspense>
              ) : (
                <EditorRouting />
              )}
            </Box>
            {/* </EditorErrorBoundary> */}
          </ThemeProvider>
        </Box>

        {!showFullScreen ? <Sidebar /> : null}
      </Flex>
    </Box>
  )
}

export default App
