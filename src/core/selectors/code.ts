import { RootState } from '../store'

export const getCode = (state: RootState) => {
  const selectedPage = state.components.present.selectedPage
  return state.code.present.pagesCode[selectedPage]
}

export const getAllPagesCode = (state: RootState) => {
  return state.code.present.pagesCode
}

export const getAllComponentsCode = (state: RootState) => {
  return state.code.present.componentsCode
}

export const getCodeState = (state: RootState) => {
  return state.code.present
}

export const getPageCode = (pageName: string) => (state: RootState) => {
  return state.code.present.pagesCode[pageName]
}
