import { createModel } from '@rematch/core'

export type CodeState = {
  code: ICode
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

const INITIAL_CODE = {
  app: DEFAULT_CODE,
  customPage: DEFAULT_CODE,
}

const code = createModel({
  state: {
    code: INITIAL_CODE,
  } as CodeState,
  reducers: {
    setCode(
      state: CodeState,
      updatedCode: string,
      selectedPage: string,
    ): CodeState {
      return {
        ...state,
        code: {
          ...state.code,
          [selectedPage]: updatedCode,
        },
      }
    },
    resetCode(state: CodeState): CodeState {
      return {
        ...state,
        code: INITIAL_CODE,
      }
    },
  },
})

export default code
