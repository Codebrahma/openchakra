import { createModel } from '@rematch/core'
import produce from 'immer'
import { generatePropId } from '../../../utils/generateId'
import { searchRootCustomComponent } from '../../../utils/recursive'
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
  ISelectedTextDetails,
  DEFAULT_ID,
  ChildrenPropDetails,
  INITIAL_STATE,
  INITIAL_COMPONENTS,
  INITIAL_PROPS,
} from './components-types'
import { DEFAULT_PROPS } from '../../../utils/defaultProps'

export type ComponentsState = {
  components: IComponents
  props: IProps
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
        draftState.components = INITIAL_COMPONENTS
        draftState.props = INITIAL_PROPS
        draftState.selectedId = DEFAULT_ID
      })
    },
    resetAll(state: ComponentsState): ComponentsState {
      return {
        ...state,
        ...INITIAL_STATE,
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
      const selectedComponent = state.components[state.selectedId]

      return {
        ...state,
        selectedId: state.components[selectedComponent.parent].id,
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
        const { selectedId } = loadRequired(draftState)
        const parentId = draftState.components[selectedId].parent

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
          draftState.components,
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
              draftState.props.byComponentId[component.id]?.push(id)
              draftState.props.byId[id] = {
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

        draftState.components = {
          ...draftState.components,
          ...components,
        }
        draftState.props = {
          byId: {
            ...draftState.props.byId,
            ...props.byId,
          },
          byComponentId: {
            ...draftState.props.byComponentId,
            ...props.byComponentId,
          },
        }
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
