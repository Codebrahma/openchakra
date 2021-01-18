import { ComponentsState } from './components'
import { CodeState } from '../code'

export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

export type CodeStateWithUndo = {
  past: CodeState[]
  present: CodeState
  future: CodeState[]
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

export const INITIAL_COMPONENTS: IComponents = {
  root: {
    id: 'root',
    type: 'Box',
    parent: '',
    children: [],
  },
}
export const INITIAL_PROPS: IProps = {
  byId: {},
  byComponentId: {
    root: [],
  },
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

export const INITIAL_STATE: ComponentsState = {
  pages: INITIAL_PAGES,
  components: INITIAL_COMPONENTS,
  props: INITIAL_PROPS,
  selectedPage: DEFAULT_PAGE,
  customComponents: {},
  customComponentsProps: {
    byId: {},
    byComponentId: {},
  },
  selectedId: DEFAULT_ID,
}
