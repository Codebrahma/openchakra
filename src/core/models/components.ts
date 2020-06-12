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
  components: IComponents
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

export const INITIAL_COMPONENTS: IComponents = {
  root: {
    id: DEFAULT_ID,
    parent: DEFAULT_ID,
    type: 'Box' as ComponentType,
    children: [],
    props: {},
  },
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

const components = createModel({
  state: {
    components: INITIAL_COMPONENTS,
    customComponents: {},
    customComponentList: [],
    selectedId: DEFAULT_ID,
  } as ComponentsState,
  reducers: {
    reset(state: ComponentsState, components?: IComponents): ComponentsState {
      return {
        ...state,
        components: components || INITIAL_COMPONENTS,
        selectedId: DEFAULT_ID,
      }
    },
    loadDemo(state: ComponentsState, type: TemplateType): ComponentsState {
      return {
        ...state,
        selectedId: 'comp-root',
        components: templates[type],
      }
    },
    resetProps(state: ComponentsState, componentId: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const component = draftState.components[componentId]

        draftState.components[componentId].props =
          DEFAULT_PROPS[component.type as ComponentType] || {}
      })
    },
    updateProps(
      state: ComponentsState,
      payload: { id: string; name: string; value: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        if (
          isChildrenOfCustomComponent(payload.id, draftState.customComponents)
        )
          draftState.customComponents[payload.id].props[payload.name] =
            payload.value
        else
          draftState.components[payload.id].props[payload.name] = payload.value
      })
    },
    addCustomProps(
      state: ComponentsState,
      payload: { name: string; targetedProp: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const selectedId = draftState.selectedId

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
          [payload.name]: '',
        }
        Object.values(draftState.components).forEach(component => {
          if (component.type === rootParent.type)
            component.props = {
              ...component.props,
              [payload.name]:
                draftState.customComponents[selectedId].props[
                  payload.targetedProp
                ] || '',
            }
        })
      })
    },
    deleteProps(state: ComponentsState, payload: { id: string; name: string }) {
      return {
        ...state,
        components: {
          ...state.components,
          [payload.id]: {
            ...state.components[payload.id],
            props: omit(state.components[payload.id].props, payload.name),
          },
        },
      }
    },
    deleteComponent(state: ComponentsState, componentId: string) {
      if (componentId === 'root') {
        return state
      }

      return produce(state, (draftState: ComponentsState) => {
        if (
          isChildrenOfCustomComponent(componentId, draftState.customComponents)
        ) {
          const component = draftState.customComponents[componentId]
          draftState.customComponents = deleteComp(
            component,
            draftState.customComponents,
          )
        } else {
          const component = draftState.components[componentId]
          draftState.components = deleteComp(component, draftState.components)
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
        const selectedComponent =
          draftState.components[payload.componentId] ||
          draftState.customComponents[payload.componentId]

        const previousParentId = selectedComponent.parent
        if (previousParentId === payload.parentId) return state

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
            draftState.components = moveToDifferentComponentsTree(
              draftState.customComponents,
              draftState.components,
              payload.componentId,
              payload.parentId,
            )
            draftState.customComponents = deleteComponent(
              draftState.customComponents[payload.componentId],
              draftState.customComponents,
            )
          }
        } else {
          draftState.components = filterChildren(
            draftState.components,
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
              draftState.components,
              draftState.customComponents,
              payload.componentId,
              payload.parentId,
            )
            draftState.components = deleteComponent(
              draftState.components[payload.componentId],
              draftState.components,
            )
          } else {
            draftState.components = moveToSameComponentsTree(
              draftState.components,
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
        let selectedComponent = draftState.components[draftState.selectedId]
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
          draftState.components = addComp(
            draftState.components,
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
          draftState.components = addComp(
            draftState.components,
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
        draftState.selectedId = payload.root
        draftState.components[payload.parent].children.push(payload.root)

        draftState.components = {
          ...draftState.components,
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
      const selectedComponent = state.components[state.selectedId]

      return {
        ...state,
        selectedId: state.components[selectedComponent.parent].id,
      }
    },
    duplicate(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const selectedComponent = draftState.components[draftState.selectedId]

        if (selectedComponent.id !== DEFAULT_ID) {
          const parentElement = draftState.components[selectedComponent.parent]

          const { newId, clonedComponents } = duplicateComponent(
            selectedComponent,
            draftState.components,
          )

          draftState.components = {
            ...draftState.components,
            ...clonedComponents,
          }
          draftState.components[parentElement.id].children.push(newId)
        }
      })
    },
    saveComponent(state: ComponentsState, name: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const selectedId = draftState.selectedId
        const component = draftState.components[selectedId]
        const { newId, clonedComponents } = duplicateComponent(
          draftState.components[selectedId],
          draftState.components,
        )
        const CustomName = name.charAt(0).toUpperCase() + name.slice(1)
        draftState.customComponents = {
          ...draftState.customComponents,
          ...clonedComponents,
          [CustomName]: {
            id: CustomName,
            type: CustomName,
            children: [newId],
            parent: '',
            props: {},
          },
        }
        draftState.customComponentList.push(CustomName)
        draftState.customComponents[newId].parent = CustomName
        draftState.components = deleteComp(component, draftState.components)
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
  },
})

export default components
