import React from 'react'
import { Flex, Box } from '@chakra-ui/core'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useSelector } from 'react-redux'
import Editor from './components/editor/Editor'
import Inspector from './components/inspector/Inspector'
import Sidebar from './components/sidebar/Sidebar'
import Header from './components/Header'
import { Global } from '@emotion/core'
import { HotKeys } from 'react-hotkeys'
import useShortcuts, { keyMap } from './hooks/useShortcuts'
// import EditorErrorBoundary from './components/errorBoundaries/EditorErrorBoundary'
import { InspectorProvider } from './contexts/inspector-context'
import { getShowFullScreen } from './core/selectors/app'
import ActionButton from './components/inspector/ActionButton'
import useDispatch from './hooks/useDispatch'

const App = () => {
  const { handlers } = useShortcuts()
  const showFullScreen = useSelector(getShowFullScreen)
  const dispatch = useDispatch()

  return (
    <HotKeys allowChanges handlers={handlers} keyMap={keyMap}>
      <Global
        styles={() => ({
          html: { minWidth: '860px', backgroundColor: '#1a202c' },
        })}
      />
      {showFullScreen ? (
        <ActionButton
          label="Go back"
          icon="arrow-back"
          position="absolute"
          top="10px"
          left="30px"
          variant="solid"
          onClick={() => dispatch.app.toggleFullScreen()}
        />
      ) : null}
      {!showFullScreen ? <Header /> : null}
      <DndProvider backend={Backend}>
        <Flex h={!showFullScreen ? 'calc(100vh - 3rem)' : '100vh'}>
          {!showFullScreen ? <Sidebar /> : null}
          {/* <EditorErrorBoundary> */}
          <Box bg="white" flex={1} zIndex={10} position="relative">
            <Editor />
          </Box>
          {/* </EditorErrorBoundary> */}
          {!showFullScreen ? (
            <Box
              maxH="calc(100vh - 3rem)"
              flex="0 0 15rem"
              bg="#f7fafc"
              overflowY="auto"
              overflowX="visible"
              borderLeft="1px solid #cad5de"
            >
              <InspectorProvider>
                <Inspector />
              </InspectorProvider>
            </Box>
          ) : null}
        </Flex>
      </DndProvider>
    </HotKeys>
  )
}

export default App
