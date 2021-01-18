import { RootState } from '../store'

// Check whether the page is custom page or not.
export const checkIsCustomPage = (state: RootState): boolean =>
  state.page.selectedPage === 'customPage' ? true : false

export const getSelectedPage = (state: RootState) => state.page.selectedPage
