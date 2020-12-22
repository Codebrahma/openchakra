import { RootState } from '../store'

export const getCode = (state: RootState) => {
  const selectedPage = state.components.present.selectedPage
  return state.code.pagesCode[selectedPage]
}

export const getAllPagesCode = (state: RootState) => {
  return state.code.pagesCode
}

export const getAllComponentsCode = (state: RootState) => {
  return state.code.componentsCode
}

export const getCodeState = (state: RootState) => {
  return state.code
}
