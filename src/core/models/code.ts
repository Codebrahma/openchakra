import { createModel } from '@rematch/core'

export type CodeState = {
  pagesCode: ICode
  componentsCode: ICode
}

const DEFAULT_CODE = `
import React from 'react'
import { Box} from '@chakra-ui/core'

const App = () => {
  return (
    <Box id='root' compId='root'></Box>
  )
}

export default App
`

export const INITIAL_CODE = {
  app: DEFAULT_CODE,
  customPage: DEFAULT_CODE,
}

export const INITIAL_CODE_STATE = {
  pagesCode: INITIAL_CODE,
  componentsCode: {},
}

const code = createModel({
  state: INITIAL_CODE_STATE as CodeState,
  reducers: {
    setPageCode(
      state: CodeState,
      updatedCode: string,
      selectedPage: string,
    ): CodeState {
      return {
        ...state,
        pagesCode: {
          ...state.pagesCode,
          [selectedPage]: updatedCode,
        },
      }
    },
    setComponentsCode(
      state: CodeState,
      updatedCode: string,
      componentName: string,
    ): CodeState {
      return {
        ...state,
        componentsCode: {
          ...state.componentsCode,
          [componentName]: updatedCode,
        },
      }
    },
    resetCodeState(state: CodeState, codeState: CodeState): CodeState {
      return codeState
    },
    resetCode(state: CodeState, pagesCode?: ICode): CodeState {
      return {
        ...state,
        pagesCode: pagesCode || INITIAL_CODE,
        componentsCode: {},
      }
    },
    resetPageCode(state: CodeState, pageName: string): CodeState {
      const newPagesCode = { ...state.pagesCode }
      newPagesCode[pageName] = DEFAULT_CODE
      return {
        ...state,
        pagesCode: newPagesCode,
      }
    },
    resetAllPagesCode(state: CodeState, pagesCode: ICode): CodeState {
      return {
        ...state,
        pagesCode: pagesCode,
      }
    },
  },
})

export default code
