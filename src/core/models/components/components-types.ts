import { ComponentsState } from './components'

export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

export type ChildrenPropDetails = Array<{
  type: string
  value: string
  componentId?: string
}>

export type ISelectedTextDetails = {
  startIndex: number
  endIndex: number
  startNodePosition: number
  endNodePosition: number
}

export const DEFAULT_ID = 'root'

export const DEFAULT_PAGE = 'app'

export const INITIAL_COMPONENTS: IComponentsById = {
  '1': {
    root: {
      id: 'root',
      type: 'Box',
      parent: '',
      children: [],
    },
  },
  '2': {
    root: {
      id: 'root',
      type: 'Box',
      parent: '',
      children: [],
    },
  },
}
export const INITIAL_PROPS: IPropsById = {
  1: {},
  2: {},
}

export const INITIAL_PAGES: IPages = {
  app: {
    id: 'app',
    name: 'App',
    componentsId: '1',
    propsId: '1',
  },
  customPage: {
    id: 'customPage',
    name: 'Custom Page',
    componentsId: '2',
    propsId: '2',
  },
}
