import { RootState } from '../store'

export const getCode = (state: RootState) => {
  const selectedPage = state.components.present.selectedPage
  return state.code.code[selectedPage]
}
