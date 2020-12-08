import { createModel } from '@rematch/core'

export type CodeState = {
  code: string
}

const DEFAULT_CODE = `
import React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/core'

const App = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
    <Box id='root' compId='root'></Box>
    </ChakraProvider>
  )
}

export default App
`

const code = createModel({
  state: {
    code: DEFAULT_CODE,
  } as CodeState,
  reducers: {
    setCode(state: CodeState, updatedCode: string): CodeState {
      return {
        ...state,
        code: updatedCode,
      }
    },
    resetCode(state: CodeState): CodeState {
      return {
        ...state,
        code: DEFAULT_CODE,
      }
    },
  },
})

export default code
