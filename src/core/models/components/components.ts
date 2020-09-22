import { createModel } from '@rematch/core'
import produce from 'immer'
import { generateId } from '../../../utils/generateId'
import {
  searchRootCustomComponent,
  duplicateComp,
} from '../../../utils/recursive'
import {
  updateInAllInstances,
  loadRequired,
} from '../../../utils/reducerUtilities'
import {
  addComponent,
  addMetaComponent,
  deleteComponent,
  duplicateComponent,
} from './componentsOperations'
import {
  updateProps,
  deleteProps,
  deleteCustomProp,
  updateChildrenPropForText,
} from './propsOperations'
import { exposeProp, unExposeProp } from './propsExposion'
import {
  addCustomComponent,
  saveComponent,
  deleteCustomComponent,
} from './customComponentsOperation'
import {
  addSpanComponent,
  removeSpanComponent,
  clearFormatting,
} from './spanOperations'
import { moveComponent } from './moveComponent'
import {
  INITIAL_COMPONENTS,
  INITIAL_PAGES,
  INITIAL_PROPS,
  ISelectedTextDetails,
  DEFAULT_ID,
  DEFAULT_PAGE,
  ChildrenPropDetails,
} from './components-types'

export type ComponentsState = {
  pages: IPages
  componentsById: IComponentsById
  propsById: IPropsById
  customComponents: IComponents
  customComponentsProps: IProp[]
  selectedPage: string
  selectedId: IComponent['id']
  hoveredId?: string
}

const components = createModel({
  state: {
    pages: INITIAL_PAGES,
    componentsById: INITIAL_COMPONENTS,
    propsById: INITIAL_PROPS,
    selectedPage: DEFAULT_PAGE,
    customComponents: {},
    customComponentsProps: [],
    selectedId: DEFAULT_ID,
  } as ComponentsState,
  reducers: {
    resetComponents(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId

        draftState.componentsById[componentsId] = {
          root: {
            id: 'root',
            type: 'Box',
            parent: '',
            children: [],
          },
        }
        draftState.propsById[propsId] = []
        draftState.selectedId = DEFAULT_ID
      })
    },
    resetAll(
      state: ComponentsState,
      importedState?: ComponentsState,
    ): ComponentsState {
      if (importedState) {
        return importedState
      } else {
        return {
          pages: INITIAL_PAGES,
          componentsById: INITIAL_COMPONENTS,
          propsById: INITIAL_PROPS,
          selectedPage: DEFAULT_PAGE,
          customComponents: {},
          customComponentsProps: [],
          selectedId: DEFAULT_ID,
        }
      }
    },
    loadDemo(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {})
    },
    resetProps(state: ComponentsState, componentId: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const propsId = draftState.pages[draftState.selectedPage].propsId
        draftState.propsById[propsId].filter(
          prop => prop.componentId !== componentId,
        )
      })
    },
    updateProps(
      state: ComponentsState,
      payload: { id: string; name: string; value: any },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        updateProps(draftState, { ...payload })
      })
    },
    exposeProp(
      state: ComponentsState,
      payload: { name: string; targetedProp: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        exposeProp(draftState, { ...payload })
      })
    },
    deleteProps(state: ComponentsState, payload: { id: string; name: string }) {
      return produce(state, (draftState: ComponentsState) => {
        deleteProps(draftState, { ...payload })
      })
    },
    deleteComponent(state: ComponentsState, componentId: string) {
      if (componentId === 'root') return state

      return produce(state, (draftState: ComponentsState) => {
        const { components, isCustomComponentChild } = loadRequired(draftState)
        const parentId = components[componentId].parent

        //The additional box of the exposed children of the box/flex can not be deleted.
        //Can not delete the immediate(outermost) children of custom component

        if (
          parentId === 'Prop' ||
          (isCustomComponentChild && components[parentId].parent.length === 0)
        )
          return state

        deleteComponent(draftState, { componentId, parentId })
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
        const { componentId } = payload
        const newParentId = payload.parentId
        const { props, components, isCustomComponentChild } = loadRequired(
          draftState,
          componentId,
        )
        const oldParentId = components[componentId].parent
        const asPropIndex = props.findIndex(
          (prop: IProp) =>
            prop.componentId === componentId && prop.name === 'as',
        )

        //It should not be moved if it is a span element
        //can not be moved into the same parent
        //Can not move the immediate(outermost) children of custom component
        //Can not move the additional box provided when children of box/flex is exposed

        if (
          asPropIndex !== -1 ||
          oldParentId === 'Prop' ||
          newParentId === oldParentId ||
          (isCustomComponentChild &&
            components[oldParentId].parent.length === 0)
        )
          return state

        moveComponent(draftState, { componentId, newParentId, oldParentId })
      })
    },
    moveSelectedComponentChildren(
      state: ComponentsState,
      payload: { componentId: string; fromIndex: number; toIndex: number },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { componentId, fromIndex, toIndex } = payload
        const { components } = loadRequired(draftState, componentId)

        const selectedComponent = components[componentId]

        components[componentId].children.splice(
          toIndex,
          0,
          selectedComponent.children.splice(fromIndex, 1)[0],
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
        addComponent(draftState, {
          parentId: payload.parentName,
          type: payload.type,
        })
      })
    },
    addCustomComponent(
      state: ComponentsState,
      payload: { parentId: string; type: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { parentId, type } = payload
        const { isCustomComponentChild } = loadRequired(draftState, parentId)

        //The custom component can not be added to its own instance
        if (isCustomComponentChild) {
          const rootCustomParent = searchRootCustomComponent(
            draftState.customComponents[parentId],
            draftState.customComponents,
          )
          if (draftState.customComponents[rootCustomParent].type === type)
            return state
        }

        addCustomComponent(draftState, { ...payload })
      })
    },
    addMetaComponent(
      state: ComponentsState,
      payload: { components: IComponents; root: string; parent: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        addMetaComponent(draftState, { ...payload })
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
      const componentsId = state.pages[state.selectedPage].componentsId
      const selectedComponent =
        state.componentsById[componentsId][state.selectedId]

      return {
        ...state,
        selectedId:
          state.componentsById[componentsId][selectedComponent.parent].id,
      }
    },
    duplicate(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { isCustomComponentChild, components, selectedId } = loadRequired(
          draftState,
        )
        const selectedComponent = components[selectedId]

        //Can not duplicate the additional box that is provided when the children of box/flex is exposed.
        //Can not duplicate the immediate(outermost) children of custom component
        if (
          selectedComponent.parent === 'Prop' ||
          (isCustomComponentChild &&
            components[selectedComponent.parent].parent.length === 0)
        )
          return state

        duplicateComponent(draftState, selectedComponent)
      })
    },
    saveComponent(state: ComponentsState, name: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { selectedId, componentsId } = loadRequired(draftState)
        const parentId =
          draftState.componentsById[componentsId][selectedId].parent

        if (parentId === 'Prop') return state

        saveComponent(draftState, {
          name,
          componentId: selectedId,
          parentId,
        })
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
    exportSelectedComponentToCustomPage(
      state: ComponentsState,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { propsId, componentsId } = loadRequired(draftState)
        const components = draftState.componentsById[componentsId]
        const props = draftState.propsById[propsId]
        const { newId, clonedComponents, clonedProps } = duplicateComp(
          components[draftState.selectedId],
          components,
          props,
        )
        //id of 2 refers to the custom component page.
        draftState.componentsById['2'] = {
          ...draftState.componentsById['2'],
          ...clonedComponents,
        }
        draftState.propsById['2'] = [
          ...draftState.propsById['2'],
          ...clonedProps,
        ]
        draftState.componentsById['2'][newId].parent = 'root'
        draftState.componentsById['2']['root'].children.push(newId)
      })
    },
    unexpose(state: ComponentsState, targetedProp: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        unExposeProp(draftState, targetedProp)
      })
    },
    deleteCustomProp(
      state: ComponentsState,
      propName: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        deleteCustomProp(draftState, propName)
      })
    },
    deleteCustomComponent(
      state: ComponentsState,
      type: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        deleteCustomComponent(draftState, type)
      })
    },
    updateTextChildrenProp(
      state: ComponentsState,
      payload: {
        id: string
        value: string | ChildrenPropDetails
      },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        updateChildrenPropForText(draftState, { ...payload })
      })
    },
    addSpan(state, payload: ISelectedTextDetails): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        addSpanComponent(draftState, { ...payload })
      })
    },
    removeSpan(state, payload: ISelectedTextDetails): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        removeSpanComponent(draftState, { ...payload })
      })
    },
    clearAllFormatting(state): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        clearFormatting(draftState)
      })
    },
    convertToContainerComponent(
      state: ComponentsState,
      payload: { customComponentType: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const { customComponentType } = payload

        const childrenProp = {
          id: '',
          name: 'children',
          value: '',
          componentId: customComponentType,
          derivedFromPropName: null,
          derivedFromComponentType: null,
        }
        updateInAllInstances(
          draftState.pages,
          draftState.componentsById,
          draftState.customComponents,
          customComponentType,
          (
            component: IComponent,
            updateInCustomComponent: Boolean,
            propsId: string,
          ) => {
            if (updateInCustomComponent)
              draftState.customComponentsProps.push({
                ...childrenProp,
                id: generateId(),
                componentId: component.id,
              })
            else
              draftState.propsById[propsId].push({
                ...childrenProp,
                id: generateId(),
                componentId: component.id,
              })
          },
        )
      })
    },
  },
})

export default components
