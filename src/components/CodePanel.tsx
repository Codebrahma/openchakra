import React, { memo, useRef } from 'react'
import { Box, Button, useClipboard } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getCode } from '../core/selectors/code'
import MonacoEditor from '@monaco-editor/react'
import { getComponentsState } from '../babel-queries/queries'
import useDispatch from '../hooks/useDispatch'

const CodePanel = () => {
  const editorRef = useRef(null)
  const dispatch = useDispatch()
  const code = useSelector(getCode)

  const handleEditorDidMount = (_: any, editor: any) => {
    editorRef.current = editor
  }
  const saveCodeHandler = () => {
    const codeEditorElement: any = editorRef.current
    if (codeEditorElement) {
      const newCode = codeEditorElement.getValue()
      dispatch.code.setCode(newCode)
      const componentsState = getComponentsState(newCode)
      dispatch.components.updateComponentsState(componentsState)
    }
  }

  const { onCopy, hasCopied } = useClipboard(code || '')

  return (
    <Box
      fontSize="sm"
      backgroundColor="white"
      overflow="auto"
      height="100%"
      position="relative"
      maxWidth="83vw"
    >
      <Button
        onClick={onCopy}
        size="sm"
        position="absolute"
        textTransform="uppercase"
        fontSize="xs"
        height="30px"
        top={3}
        right="2.25em"
        zIndex={100}
        bg="#8888FC"
        color="white"
        _hover={{ bg: '#4D3DF7' }}
      >
        {hasCopied ? 'copied' : 'copy'}
      </Button>
      <Button
        onClick={saveCodeHandler}
        size="sm"
        position="absolute"
        textTransform="uppercase"
        fontSize="xs"
        height="30px"
        top={20}
        right="2.25em"
        zIndex={100}
        bg="#8888FC"
        color="white"
        _hover={{ bg: '#4D3DF7' }}
      >
        Save Code
      </Button>

      <MonacoEditor
        height="100%"
        value={code}
        language="javascript"
        editorDidMount={handleEditorDidMount}
        theme="dark"
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: 'hidden',
          },
        }}
      />
    </Box>
  )
}

export default memo(CodePanel)
