import { createModel } from '@rematch/core'
import produce from 'immer'
import { DEFAULT_PROPS } from '../../utils/defaultProps'
import templates, { TemplateType } from '../../templates'
import { generateId } from '../../utils/generateId'
import {
  duplicateComponent,
  deleteComponent,
  searchParent,
} from '../../utils/recursive'
import omit from 'lodash/omit'

export type ComponentsState = {
  pages: IPages
  selectedPage: string
  customComponents: IComponents
  customComponentList: string[]
  selectedId: IComponent['id']
  hoveredId?: IComponent['id']
}
export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

const DEFAULT_ID = 'root'

const DEFAULT_PAGE = 'app'

export const INITIAL_COMPONENTS: IComponents = {
  root: {
    id: DEFAULT_ID,
    parent: DEFAULT_ID,
    type: 'Box' as ComponentType,
    children: [],
    props: {},
  },
}

export const INITIAL_PAGES: IPages = {
  app: INITIAL_COMPONENTS,
  custom: INITIAL_COMPONENTS,
}

const isChildrenOfCustomComponent = (
  id: string,
  customComponents: IComponents,
) => {
  if (customComponents[id] !== undefined) return true
  return false
}

const filterChildren = (
  components: IComponents,
  id: string,
  childToRemove: string,
) => {
  const children = components[id].children.filter(id => id !== childToRemove)
  components[id].children = children
  return components
}

const deleteComp = (component: IComponent, components: IComponents) => {
  components = filterChildren(components, component.parent, component.id)
  components = deleteComponent(component, components)
  return components
}
const addComp = (
  components: IComponents,
  parentId: string,
  component: IComponent,
) => {
  components = {
    ...components,
    [component.id]: {
      ...component,
    },
  }
  components[parentId].children.push(component.id)
  return components
}

const moveToSameComponentsTree = (
  components: IComponents,
  id: string,
  newParentId: string,
) => {
  components[id].parent = newParentId
  components[newParentId].children.push(id)
  return components
}

const moveToDifferentComponentsTree = (
  sourceComponents: IComponents,
  destinationComponents: IComponents,
  id: string,
  newParentId: string,
) => {
  const { newId, clonedComponents } = duplicateComponent(
    sourceComponents[id],
    sourceComponents,
  )
  destinationComponents = {
    ...destinationComponents,
    ...clonedComponents,
  }
  destinationComponents[newId].parent = newParentId
  destinationComponents[newParentId].children.push(newId)
  return destinationComponents
}

const updateInstancesInAllPages = (
  pages: IPages,
  ComponentType: string,
  propName: string,
  propValue: string,
) => {
  Object.values(pages).forEach(components => {
    Object.values(components).forEach(component => {
      if (component.type === ComponentType)
        component.props = {
          ...component.props,
          [propName]: propValue,
        }
    })
  })
  return pages
}

const components = createModel({
  state: {
    pages: INITIAL_PAGES,
    selectedPage: DEFAULT_PAGE,
    customComponents: {},
    customComponentList: [],
    selectedId: DEFAULT_ID,
  } as ComponentsState,
  reducers: {
    reset(state: ComponentsState, components?: IComponents): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        draftState.pages[draftState.selectedPage] =
          components || INITIAL_COMPONENTS
      })
    },
    loadDemo(state: ComponentsState, type: TemplateType): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        draftState.pages[draftState.selectedPage] = templates[type]
      })
    },
    resetProps(state: ComponentsState, componentId: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const components = draftState.pages[draftState.selectedPage]
        const component = components[componentId]

        components[componentId].props =
          DEFAULT_PROPS[component.type as ComponentType] || {}
      })
    },
    updateProps(
      state: ComponentsState,
      payload: { id: string; name: string; value: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const components = draftState.pages[draftState.selectedPage]
        if (
          isChildrenOfCustomComponent(payload.id, draftState.customComponents)
        ) {
          if (draftState.selectedPage === 'custom')
            draftState.customComponents[payload.id].props[payload.name] =
              payload.value
        } else components[payload.id].props[payload.name] = payload.value
      })
    },
    addCustomProps(
      state: ComponentsState,
      payload: { name: string; targetedProp: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const selectedId = draftState.selectedId
        const components = draftState.pages[draftState.selectedPage]

        if (
          isChildrenOfCustomComponent(selectedId, draftState.customComponents)
        ) {
          const propValue =
            draftState.customComponents[selectedId].props[
              payload.targetedProp
            ] || ''
          draftState.customComponents[selectedId].propRefs = {
            ...draftState.customComponents[selectedId].propRefs,
            [payload.targetedProp]: {
              targetedProp: payload.targetedProp,
              customPropName: payload.name,
            },
          }

          const rootParent = searchParent(
            draftState.customComponents[selectedId],
            draftState.customComponents,
            draftState.customComponentList,
          )
          draftState.customComponents[rootParent.id].props = {
            ...draftState.customComponents[rootParent.id].props,
            [payload.name]: propValue,
          }
          draftState.pages = updateInstancesInAllPages(
            draftState.pages,
            rootParent.type,
            payload.name,
            propValue,
          )
        } else {
          const propValue =
            components[selectedId].props[payload.targetedProp] || ''

          components[selectedId].propRefs = {
            ...components[selectedId].propRefs,
            [payload.targetedProp]: {
              targetedProp: payload.targetedProp,
              customPropName: payload.name,
              value: propValue,
            },
          }
        }
      })
    },
    deleteProps(state: ComponentsState, payload: { id: string; name: string }) {
      const components = state.pages[state.selectedPage]

      return {
        ...state,
        components: {
          ...components,
          [payload.id]: {
            ...components[payload.id],
            props: omit(components[payload.id].props, payload.name),
          },
        },
      }
    },
    deleteComponent(state: ComponentsState, componentId: string) {
      if (componentId === 'root') {
        return state
      }

      return produce(state, (draftState: ComponentsState) => {
        const components = draftState.pages[draftState.selectedPage]

        //check whether the component deleted is the children of custom components.
        if (
          isChildrenOfCustomComponent(componentId, draftState.customComponents)
        ) {
          const component = draftState.customComponents[componentId]
          draftState.customComponents = deleteComp(
            component,
            draftState.customComponents,
          )
        } else {
          const component = components[componentId]
          draftState.pages[draftState.selectedPage] = deleteComp(
            component,
            components,
          )
        }
        draftState.selectedId = DEFAULT_ID
      })
    },
    moveComponent(
      state: ComponentsState,
      payload: { parentId: string; componentId: string },
    ): ComponentsState {
      if (payload.parentId === payload.componentId) {
        return state
      }

      return produce(state, (draftState: ComponentsState) => {
        let components = draftState.pages[draftState.selectedPage]

        const selectedComponent =
          components[payload.componentId] ||
          draftState.customComponents[payload.componentId]

        const previousParentId = selectedComponent.parent
        if (previousParentId === payload.parentId) return state

        //check whether the component is moved from the custom component or not.
        if (
          isChildrenOfCustomComponent(
            previousParentId,
            draftState.customComponents,
          )
        ) {
          draftState.customComponents = filterChildren(
            draftState.customComponents,
            previousParentId,
            payload.componentId,
          )
          if (
            isChildrenOfCustomComponent(
              payload.parentId,
              draftState.customComponents,
            )
          ) {
            draftState.customComponents = moveToSameComponentsTree(
              draftState.customComponents,
              payload.componentId,
              payload.parentId,
            )
          } else {
            components = moveToDifferentComponentsTree(
              draftState.customComponents,
              components,
              payload.componentId,
              payload.parentId,
            )
            draftState.customComponents = deleteComponent(
              draftState.customComponents[payload.componentId],
              draftState.customComponents,
            )
          }
        } else {
          components = filterChildren(
            components,
            previousParentId,
            payload.componentId,
          )
          if (
            isChildrenOfCustomComponent(
              payload.parentId,
              draftState.customComponents,
            )
          ) {
            draftState.customComponents = moveToDifferentComponentsTree(
              components,
              draftState.customComponents,
              payload.componentId,
              payload.parentId,
            )
            components = deleteComponent(
              components[payload.componentId],
              components,
            )
          } else {
            components = moveToSameComponentsTree(
              components,
              payload.componentId,
              payload.parentId,
            )
          }
        }
        draftState.selectedId = DEFAULT_ID
      })
    },
    moveSelectedComponentChildren(
      state: ComponentsState,
      payload: { fromIndex: number; toIndex: number },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const components = draftState.pages[draftState.selectedPage]
        let selectedComponent = components[draftState.selectedId]
        if (
          isChildrenOfCustomComponent(
            draftState.selectedId,
            draftState.customComponents,
          )
        )
          selectedComponent = draftState.customComponents[draftState.selectedId]

        selectedComponent.children.splice(
          payload.toIndex,
          0,
          selectedComponent.children.splice(payload.fromIndex, 1)[0],
        )
      })
    },
    addComponent(
      state: ComponentsState,
      payload: {
        parentName: string
        type: ComponentType
        rootParentType?: ComponentType
        testId?: string
      },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const id = payload.testId || generateId()

        const component = {
          id,
          props: DEFAULT_PROPS[payload.type] || {},
          children: [],
          type: payload.type,
          parent: payload.parentName,
          rootParentType: payload.rootParentType || payload.type,
        }
        draftState.selectedId = id

        //check whether the component is added into any children of custom component
        if (
          isChildrenOfCustomComponent(
            payload.parentName,
            draftState.customComponents,
          )
        ) {
          draftState.customComponents = addComp(
            draftState.customComponents,
            payload.parentName,
            component,
          )
        } else {
          draftState.pages[draftState.selectedPage] = addComp(
            draftState.pages[draftState.selectedPage],
            payload.parentName,
            component,
          )
        }
      })
    },
    addCustomComponent(
      state: ComponentsState,
      payload: { parentId: string; type: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const customComponent = draftState.customComponents[payload.type]
        const id = generateId()
        const component = {
          id,
          props: { ...customComponent.props },
          children: [],
          type: payload.type,
          parent: payload.parentId,
        }

        //check whether the component is added into any children of custom component

        if (
          isChildrenOfCustomComponent(
            payload.parentId,
            draftState.customComponents,
          )
        ) {
          draftState.customComponents = addComp(
            draftState.customComponents,
            payload.parentId,
            component,
          )
        } else {
          draftState.pages[draftState.selectedPage] = addComp(
            draftState.pages[draftState.selectedPage],
            payload.parentId,
            component,
          )
        }
      })
    },
    addMetaComponent(
      state: ComponentsState,
      payload: { components: IComponents; root: string; parent: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        let components = draftState.pages[draftState.selectedPage]
        draftState.selectedId = payload.root
        components[payload.parent].children.push(payload.root)

        draftState.pages[draftState.selectedPage] = {
          ...components,
          ...payload.components,
        }
      })
    },
    select(
      state: ComponentsState,
      selectedId: IComponent['id'],
    ): ComponentsState {
      return {
        ...state,
        selectedId,
      }
    },
    unselect(state: ComponentsState): ComponentsState {
      return {
        ...state,
        selectedId: DEFAULT_ID,
      }
    },
    selectParent(state: ComponentsState): ComponentsState {
      const components = state.pages[state.selectedPage]
      const selectedComponent = components[state.selectedId]

      return {
        ...state,
        selectedId: components[selectedComponent.parent].id,
      }
    },
    duplicate(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        let components = draftState.pages[draftState.selectedPage]

        const selectedComponent = components[draftState.selectedId]

        if (selectedComponent.id !== DEFAULT_ID) {
          const parentElement = components[selectedComponent.parent]

          const { newId, clonedComponents } = duplicateComponent(
            selectedComponent,
            components,
          )

          components = {
            ...components,
            ...clonedComponents,
          }
          components[parentElement.id].children.push(newId)
        }
      })
    },
    saveComponent(state: ComponentsState, name: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        let components = draftState.pages[draftState.selectedPage]
        const selectedId = draftState.selectedId
        const component = components[selectedId]
        const CustomName = name.charAt(0).toUpperCase() + name.slice(1)
        const { newId, clonedComponents, props } = duplicateComponent(
          components[selectedId],
          components,
          true,
        )
        draftState.customComponents = {
          ...draftState.customComponents,
          ...clonedComponents,
          [CustomName]: {
            id: CustomName,
            type: CustomName,
            children: [newId],
            parent: '',
            props: props,
          },
        }
        draftState.customComponentList.push(CustomName)
        draftState.customComponents[newId].parent = CustomName

        //delete the original copy.
        draftState.pages[draftState.selectedPage] = deleteComp(
          component,
          components,
        )
        draftState.selectedId = DEFAULT_ID
      })
    },
    hover(
      state: ComponentsState,
      componentId: IComponent['id'],
    ): ComponentsState {
      return {
        ...state,
        hoveredId: componentId,
      }
    },
    unhover(state: ComponentsState): ComponentsState {
      return {
        ...state,
        hoveredId: undefined,
      }
    },
    switchPage(state: ComponentsState, page: string): ComponentsState {
      return {
        ...state,
        selectedPage: page,
      }
    },
  },
})

export default components
