import React, { memo, useRef, useState, useEffect } from 'react'
import { Box, Button, useClipboard } from '@chakra-ui/core'
import { useSelector } from 'react-redux'
import { getCode } from '../core/selectors/code'
import MonacoEditor from '@monaco-editor/react'
import babelQueries from '../babel-queries/queries'
import useDispatch from '../hooks/useDispatch'
import formatCode from '../utils/codeGeneration/formatCode'
import {
  getAllUsedComponents,
  getSelectedPage,
} from '../core/selectors/components'

const CodePanel = () => {
  const editorRef = useRef(null)
  const dispatch = useDispatch()
  const [formattedCode, setFormattedCode] = useState('')

  // This includes code with compId prop added to every component.
  const transformedCode = useSelector(getCode)
  const allComponents = useSelector(getAllUsedComponents)
  const selectedPage = useSelector(getSelectedPage)

  useEffect(() => {
    // While displaying the code, the comp-id that is been added should be removed.
    const code = babelQueries.removeComponentId(transformedCode)
    const codeWithImports = babelQueries.addComponentImports(code, {
      components: allComponents,
    })

    formatCode(codeWithImports).then(code => setFormattedCode(code))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditorDidMount = (_: any, editor: any) => {
    editorRef.current = editor
  }
  const saveCodeHandler = () => {
    const codeEditorElement: any = editorRef.current
    if (codeEditorElement) {
      const newCode = codeEditorElement.getValue()

      // Id is set to the props of the every component.
      // This is done for identification of components using id.
      const transformedCode = babelQueries.setIdToComponents(newCode)
      const componentsState = babelQueries.getComponentsState(transformedCode)
      dispatch.code.setCode(transformedCode, selectedPage)
      dispatch.components.updateComponentsState(componentsState)
    }
  }

  const { onCopy, hasCopied } = useClipboard(formattedCode || '')

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
        value={formattedCode}
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
