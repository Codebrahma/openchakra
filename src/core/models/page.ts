import { createModel } from '@rematch/core'

export type PageState = {
  pages: IPages
  selectedPage: string
}

export const INITIAL_PAGES = {
  app: {
    id: 'app',
    name: 'App',
  },
  customPage: {
    id: 'customPage',
    name: 'Custom Page',
  },
}

const page = createModel({
  state: {
    pages: INITIAL_PAGES,
    selectedPage: 'app',
  } as PageState,
  reducers: {
    switchPage(state: PageState, page: string): PageState {
      return {
        ...state,
        selectedPage: page,
      }
    },
  },
})

export default page
