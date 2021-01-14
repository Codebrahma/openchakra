import { createModel } from '@rematch/core'
import produce from 'immer'
import { generatePropId } from '../../../utils/generateId'
import {
  searchRootCustomComponent,
  duplicateComp,
} from '../../../utils/recursive'
import {
  updateInAllInstances,
  loadRequired,
  mergeProps,
} from '../../../utils/reducerUtilities'
import {
  addComponent,
  addMetaComponent,
  deleteComponent,
  duplicateComponent,
} from './componentsOperations'
import {
  updateProp,
  deleteProps,
  deleteCustomProp,
  updateChildrenPropForText,
  addProps,
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
  INITIAL_STATE,
} from './components-types'
import { DEFAULT_PROPS } from '../../../utils/defaultProps'

export type ComponentsState = {
  pages: IPages
  componentsById: IComponentsById
  propsById: IPropsByPageId
  customComponents: IComponents
  customComponentsProps: IProps
  selectedPage: string
  selectedId: IComponent['id']
  hoveredId?: string
}

const components = createModel({
  state: INITIAL_STATE as ComponentsState,
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
        draftState.propsById[propsId] = {
          byId: {},
          byComponentId: {},
        }
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
          customComponentsProps: {
            byId: {},
            byComponentId: {},
          },
          selectedId: DEFAULT_ID,
        }
      }
    },
    loadDemo(state: ComponentsState): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {})
    },
    resetProps(state: ComponentsState, componentId: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { components, props } = loadRequired(draftState)
        const defaultProps =
          DEFAULT_PROPS[components[componentId].type as ComponentType]
        const PropIdsToRetain: IProp['id'][] = []

        // If the component has a default value for a prop, retain that prop and substitute the prop with default value.
        // If the component does not have a default value, delete that prop.
        props.byComponentId[componentId].forEach(propId => {
          const defaultPropValue = defaultProps[props.byId[propId].name]
          if (defaultPropValue !== undefined) {
            props.byId[propId].value = defaultPropValue
            PropIdsToRetain.push(propId)
          } else delete props.byId[propId]
        })
        props.byComponentId[componentId] = PropIdsToRetain
      })
    },
    updateProp(
      state: ComponentsState,
      payload: { componentId: string; id: string; name: string; value: any },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        updateProp(draftState, { ...payload })
      })
    },
    addProps(state: ComponentsState, propsObjectToAdd: any) {
      return produce(state, (draftState: ComponentsState) => {
        addProps(draftState, propsObjectToAdd)
      })
    },
    exposeProp(
      state: ComponentsState,
      payload: { name: string; targetedProp: string; boxId?: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        exposeProp(draftState, { ...payload })
      })
    },
    deleteProps(
      state: ComponentsState,
      payload: { componentId: string; propId: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        deleteProps(draftState, { ...payload })
      })
    },
    deleteComponent(state: ComponentsState, componentId?: string) {
      if (componentId === 'root') return state

      return produce(state, (draftState: ComponentsState) => {
        const { components, isCustomComponentChild } = loadRequired(draftState)
        const selectedId = componentId || draftState.selectedId
        const parentId = components[selectedId].parent

        //The additional box of the exposed children of the box/flex can not be deleted.
        //Can not delete the immediate(outermost) children of custom component

        if (
          parentId === 'Prop' ||
          (isCustomComponentChild && components[parentId].parent.length === 0)
        )
          return state

        deleteComponent(draftState, { componentId: selectedId, parentId })
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

        const selectedComponentPropIds = props.byComponentId[componentId]

        const asPropIndex = selectedComponentPropIds.findIndex(
          (id: string) => props.byId[id].name === 'span',
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
        componentId: string
        parentId: string
        type: ComponentType
      },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        addComponent(draftState, payload)
      })
    },
    addCustomComponent(
      state: ComponentsState,
      payload: {
        componentId: string
        parentId: string
        type: string
        defaultProps: IProp[]
      },
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
        const { components, root, parent } = payload
        addMetaComponent(draftState, { components, root, parentId: parent })
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
    duplicate(state: ComponentsState, componentIds: string[]): ComponentsState {
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

        duplicateComponent(draftState, selectedComponent, componentIds)
      })
    },
    saveComponent(
      state: ComponentsState,
      name: string,
      componentInstanceId: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { selectedId, componentsId } = loadRequired(draftState)
        const parentId =
          draftState.componentsById[componentsId][selectedId].parent

        if (parentId === 'Prop') return state

        saveComponent(draftState, {
          name,
          componentId: selectedId,
          parentId,
          componentInstanceId,
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
      componentIds: string[],
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { propsId, componentsId } = loadRequired(draftState)
        const components = draftState.componentsById[componentsId]
        const props = draftState.propsById[propsId]
        const { newId, clonedComponents, clonedProps } = duplicateComp(
          components[draftState.selectedId],
          components,
          props,
          componentIds,
        )
        //id of 2 refers to the custom component page.
        draftState.componentsById['2'] = {
          ...draftState.componentsById['2'],
          ...clonedComponents,
        }

        mergeProps(draftState.propsById['2'], clonedProps)
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
            if (updateInCustomComponent) {
              const id = generatePropId()
              draftState.customComponentsProps.byComponentId[
                component.id
              ]?.push(id)
              draftState.customComponentsProps.byId[id] = {
                ...childrenProp,
                id: generatePropId(),
              }
            } else {
              const id = generatePropId()
              draftState.propsById[propsId].byComponentId[component.id]?.push(
                id,
              )
              draftState.propsById[propsId].byId[id] = {
                ...childrenProp,
                id: generatePropId(),
              }
            }
          },
        )
      })
    },
    updateComponentsState(
      state: ComponentsState,
      payload: {
        components: IComponents
        props: IProps
      },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const { components, props } = payload
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].componentsId

        draftState.componentsById[componentsId] = components
        draftState.propsById[propsId] = props
      })
    },
    updateCustomComponentsState(
      state: ComponentsState,
      payload: {
        components: IComponents
        props: IProps
      },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const { components, props } = payload

        draftState.customComponents = {
          ...draftState.customComponents,
          ...components,
        }
        draftState.customComponentsProps = {
          byId: {
            ...draftState.customComponentsProps.byId,
            ...props.byId,
          },
          byComponentId: {
            ...draftState.customComponentsProps.byComponentId,
            ...props.byComponentId,
          },
        }
      })
    },
  },
})

export default components
