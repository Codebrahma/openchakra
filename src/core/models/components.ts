import { createModel } from '@rematch/core'
import produce from 'immer'
import { generateId } from '../../utils/generateId'
import { DEFAULT_PROPS } from '../../utils/defaultProps'
import {
  deleteComp,
  fetchAndUpdateExposedProps,
  moveComponent,
  searchRootCustomComponent,
} from '../../utils/recursive'

export type ComponentsState = {
  pages: IPages
  componentsById: IComponentById
  propsById: IPropsById
  customComponents: IComponents
  customComponentsProps: IProp[]
  selectedPage: string
  selectedId: IComponent['id']
  hoveredId?: string
}
export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

const DEFAULT_ID = 'root'

const DEFAULT_PAGE = 'app'

export const INITIAL_COMPONENTS: IComponentById = {
  '1': {
    root: {
      id: 'root',
      type: 'Box',
      parent: '',
    },
  },
  '2': {
    root: {
      id: 'root',
      type: 'Box',
      parent: '',
    },
  },
}
const INITIAL_PROPS: IPropsById = {
  1: [],
  2: [],
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

function checkIsChildOfCustomComponent(
  componentId: string,
  customComponents: IComponents,
) {
  if (customComponents[componentId]) return true
  return false
}

const duplicateProps = (props: IProp[], componentId: string) => {
  const duplicatedProps: IProp[] = []

  props.forEach(prop => {
    duplicatedProps.push({
      ...prop,
      id: generateId(),
      componentId,
    })
  })
  return duplicatedProps
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
    reset(state: ComponentsState, components?: IComponents): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        draftState.componentsById = INITIAL_COMPONENTS
        draftState.selectedId = DEFAULT_ID
      })
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
      payload: { id: string; name: string; value: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const { id, name, value } = payload
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )
        const propsId = draftState.pages[draftState.selectedPage].propsId

        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        //If the prop is already found, update the prop value or else add the prop.
        const existingPropIndex = props.findIndex(
          prop => prop.componentId === id && prop.name === name,
        )

        if (existingPropIndex !== -1) props[existingPropIndex].value = value
        else
          props.push({
            id: generateId(),
            name: name,
            value: value,
            componentId: id,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          })
        if (isCustomComponentChild)
          draftState.customComponentsProps = [...props]
        else draftState.propsById[propsId] = [...props]
      })
    },
    exposeProp(
      state: ComponentsState,
      payload: { name: string; targetedProp: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const customPropName = payload.name

        const isCustomComponentChild = checkIsChildOfCustomComponent(
          componentId,
          draftState.customComponents,
        )

        if (isCustomComponentChild) {
          //root parent element of the custom component
          const rootCustomParent = searchRootCustomComponent(
            draftState.customComponents[componentId],
            draftState.customComponents,
          )

          let propValue = ''
          const propIndex = draftState.customComponentsProps.findIndex(
            prop =>
              prop.componentId === componentId &&
              prop.name === payload.targetedProp,
          )

          if (propIndex !== -1) {
            propValue = draftState.customComponentsProps[propIndex].value

            draftState.customComponentsProps[
              propIndex
            ].derivedFromComponentType =
              state.customComponents[rootCustomParent].type

            draftState.customComponentsProps[
              propIndex
            ].derivedFromPropName = customPropName
          } else {
            //Add the exposed prop in the custom props
            draftState.customComponentsProps.push({
              id: generateId(),
              name: payload.targetedProp,
              value: '',
              componentId,
              derivedFromPropName: customPropName,
              derivedFromComponentType:
                state.customComponents[rootCustomParent].type,
            })
          }

          //find whether there is a existing prop similar to the custom prop in the root custom parent
          const isPropPresent = draftState.customComponentsProps.findIndex(
            prop =>
              prop.componentId === rootCustomParent &&
              prop.name === customPropName,
          )
          //Add props for all the instances of the custom components only when there is no similar prop present
          if (isPropPresent === -1) {
            Object.values(draftState.componentsById[componentsId])
              .filter(component => component.type === rootCustomParent)
              .forEach(component => {
                draftState.propsById[propsId].push({
                  id: generateId(),
                  name: customPropName,
                  value: propValue,
                  componentId: component.id,
                  derivedFromPropName: null,
                  derivedFromComponentType: null,
                })
              })
            Object.values(state.customComponents)
              .filter(component => component.type === rootCustomParent)
              .forEach(component => {
                draftState.customComponentsProps.push({
                  id: generateId(),
                  name: customPropName,
                  value: propValue,
                  componentId: component.id,
                  derivedFromPropName: null,
                  derivedFromComponentType: null,
                })
              })
          }
        } else {
          const propIndex = draftState.propsById[propsId].findIndex(
            prop =>
              prop.componentId === componentId &&
              prop.name === payload.targetedProp,
          )
          if (propIndex !== -1)
            draftState.propsById[propsId][
              propIndex
            ].derivedFromPropName = customPropName
          else {
            //Add the exposed prop in the props
            draftState.propsById[propsId].push({
              id: generateId(),
              name: payload.targetedProp,
              value: '',
              componentId,
              derivedFromPropName: customPropName,
              derivedFromComponentType: null,
            })
          }
        }
      })
    },
    deleteProps(state: ComponentsState, payload: { id: string; name: string }) {
      console.log('delete-props')
    },
    deleteComponent(state: ComponentsState, componentId: string) {
      if (componentId === 'root') {
        return state
      }

      return produce(state, (draftState: ComponentsState) => {
        //check if the component is added in components structure or in custom components structure
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          componentId,
          draftState.customComponents,
        )
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        let components = isCustomComponentChild
          ? { ...draftState.customComponents }
          : { ...draftState.componentsById[componentsId] }

        const propsId = draftState.pages[draftState.selectedPage].propsId
        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const { updatedComponents, updatedProps } = deleteComp(
          components[componentId],
          components,
          props,
        )

        draftState.selectedId = DEFAULT_ID
        if (isCustomComponentChild) {
          draftState.customComponents = updatedComponents
          draftState.customComponentsProps = updatedProps
        } else {
          draftState.componentsById[componentsId] = updatedComponents
          draftState.propsById[propsId] = updatedProps
        }
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
        const componentsId = state.pages[state.selectedPage].componentsId
        const propsId = state.pages[state.selectedPage].propsId

        if (
          checkIsChildOfCustomComponent(componentId, state.customComponents)
        ) {
          //moved from custom component to another custom component
          if (
            checkIsChildOfCustomComponent(newParentId, state.customComponents)
          )
            draftState.customComponents[componentId].parent = newParentId
          //moved from custom component to components data
          else {
            const {
              updatedSourceComponents: updatedCustomComponents,
              updatedDestinationComponents: updatedComponents,
              updatedSourceProps: updatedCustomComponentProps,
              updatedDestinationProps: updatedProps,
            } = moveComponent(
              componentId,
              draftState.customComponents,
              draftState.componentsById[componentsId],
              draftState.customComponentsProps,
              draftState.propsById[propsId],
            )
            draftState.componentsById[componentsId] = { ...updatedComponents }
            draftState.customComponents = { ...updatedCustomComponents }
            draftState.componentsById[componentsId][
              componentId
            ].parent = newParentId
            draftState.propsById[propsId] = [...updatedProps]
            draftState.customComponentsProps = [...updatedCustomComponentProps]
          }
        } else {
          //moved from components data to the custom component
          if (
            checkIsChildOfCustomComponent(newParentId, state.customComponents)
          ) {
            const {
              updatedSourceComponents: updatedComponents,
              updatedDestinationComponents: updatedCustomComponents,
              updatedSourceProps: updatedProps,
              updatedDestinationProps: updatedCustomComponentProps,
            } = moveComponent(
              componentId,
              draftState.componentsById[componentsId],
              draftState.customComponents,
              draftState.propsById[propsId],
              draftState.customComponentsProps,
            )
            draftState.componentsById[componentsId] = { ...updatedComponents }
            draftState.customComponents = { ...updatedCustomComponents }
            draftState.customComponents[componentId].parent = newParentId
            draftState.propsById[propsId] = [...updatedProps]
            draftState.customComponentsProps = [...updatedCustomComponentProps]
          }

          //moved inside the components data
          else
            draftState.componentsById[componentsId][
              componentId
            ].parent = newParentId
        }

        draftState.selectedId = DEFAULT_ID
      })
    },
    moveSelectedComponentChildren(
      state: ComponentsState,
      payload: { fromIndex: number; toIndex: number },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        // const componentsId =
        //   draftState.pages[draftState.selectedPage].componentsId
        // let selectedComponent =
        //   draftState.componentsById[componentsId][draftState.selectedId]
        // if (
        //   checkIsChildOfCustomComponent(
        //     draftState.selectedId,
        //     draftState.customComponents,
        //   )
        // )
        //   selectedComponent = draftState.customComponents[draftState.selectedId]
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
        const id = generateId()
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId

        //check if the component is added in components structure or in custom components structure
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          payload.parentName,
          draftState.customComponents,
        )

        const props: IProp[] = []

        DEFAULT_PROPS[payload.type] &&
          Object.keys(DEFAULT_PROPS[payload.type]).forEach(
            (propName: string) => {
              props.push({
                id: generateId(),
                name: propName,
                value: DEFAULT_PROPS[payload.type][propName],
                componentId: id,
                derivedFromPropName: null,
                derivedFromComponentType: null,
              })
            },
          )
        if (isCustomComponentChild) {
          draftState.customComponents[id] = {
            id,
            type: payload.type,
            parent: payload.parentName,
          }
          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...props,
          ]
        } else {
          draftState.componentsById[componentsId][id] = {
            id,
            type: payload.type,
            parent: payload.parentName,
          }
          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...props,
          ]
        }
        draftState.selectedId = id
      })
    },
    addCustomComponent(
      state: ComponentsState,
      payload: { parentId: string; type: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const id = generateId()
        const { type, parentId } = payload

        //check if the component is added in components structure or in custom components structure
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          parentId,
          draftState.customComponents,
        )

        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId

        //find whether the props should be added in normal props array or in custom props array
        const propsId = draftState.pages[draftState.selectedPage].propsId

        const customComponentsProps = [...state.customComponentsProps]

        const duplicatedProps = duplicateProps(
          customComponentsProps.filter(prop => prop.componentId === type),
          id,
        )

        if (isCustomComponentChild) {
          draftState.customComponents[id] = {
            id,
            type: payload.type,
            parent: parentId,
          }
          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...duplicatedProps,
          ]
        } else {
          draftState.componentsById[componentsId][id] = {
            id,
            type: payload.type,
            parent: parentId,
          }
          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...duplicatedProps,
          ]
        }

        draftState.selectedId = id
      })
    },
    addMetaComponent(
      state: ComponentsState,
      payload: { components: IComponents; root: string; parent: string },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { components, root, parent } = payload
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          parent,
          draftState.customComponents,
        )

        const newProps: IProp[] = []

        Object.values(components).forEach(component => {
          DEFAULT_PROPS[component.type as ComponentType] &&
            Object.keys(DEFAULT_PROPS[component.type as ComponentType]).forEach(
              (propName: string) => {
                newProps.push({
                  id: generateId(),
                  name: propName,
                  value:
                    DEFAULT_PROPS[component.type as ComponentType][propName],
                  componentId: component.id,
                  derivedFromPropName: null,
                  derivedFromComponentType: null,
                })
              },
            )
        })
        if (isCustomComponentChild) {
          draftState.customComponents = {
            ...draftState.customComponents,
            ...components,
          }
          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...newProps,
          ]
          draftState.customComponents[root].parent = parent
        } else {
          draftState.componentsById[componentsId] = {
            ...draftState.componentsById[componentsId],
            ...components,
          }
          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...newProps,
          ]
          draftState.componentsById[componentsId][root].parent = parent
        }
        draftState.selectedId = root
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
        console.log('duplicate')
      })
    },
    saveComponent(state: ComponentsState, name: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const newId = generateId()

        const componentsId = state.pages[state.selectedPage].componentsId
        const propsId = state.pages[state.selectedPage].propsId

        //move the component from the components data to custom components data
        //move the component props from propsId to custom components props

        const {
          updatedSourceComponents: updatedComponents,
          updatedDestinationComponents: updatedCustomComponents,
          updatedSourceProps: updatedProps,
          updatedDestinationProps: updatedCustomComponentsProps,
        } = moveComponent(
          componentId,
          draftState.componentsById[componentsId],
          draftState.customComponents,
          draftState.propsById[propsId],
          draftState.customComponentsProps,
        )

        //Add the outer container in both components(instance) and custom components(original)
        draftState.componentsById[componentsId] = {
          ...updatedComponents,
          [newId]: {
            id: newId,
            type: name,
            parent: draftState.componentsById[componentsId][componentId].parent,
          },
        }
        draftState.customComponents = {
          ...updatedCustomComponents,
          [name]: {
            id: name,
            type: name,
            parent: '',
          },
        }

        //change the parent of the child
        draftState.customComponents[componentId].parent = name

        //find the exposed props and update in the root parent of the custom component
        //Also update the derivedFromComponentType for the exposed props

        const {
          rootParentProps,
          updatedProps: customProps,
        } = fetchAndUpdateExposedProps(
          name,
          draftState.customComponents[componentId],
          draftState.customComponents,
          updatedCustomComponentsProps,
        )
        //make a duplicate props for the instance of the custom component.
        const duplicatedProps = duplicateProps(rootParentProps, newId)
        draftState.propsById[propsId] = [...updatedProps, ...duplicatedProps]
        draftState.customComponentsProps = [
          ...draftState.customComponentsProps,
          ...customProps,
          ...rootParentProps,
        ]
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
        // const componentsId =
        //   draftState.pages[draftState.selectedPage].componentsId
        // const components = draftState.componentsById[componentsId]
        // const { newId, clonedComponents } = duplicateComponent(
        //   components[draftState.selectedId],
        //   components,
        // )
        // draftState.pages['custom'] = {
        //   ...draftState.pages['custom'],
        //   ...clonedComponents,
        // }
        // draftState.componentsById['2'][newId].parent = 'root'
      })
    },
    unexpose(state: ComponentsState, targetedProp: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const propName = targetedProp
        const componentsId = state.pages[state.selectedPage].componentsId
        const propsId = state.pages[state.selectedPage].propsId
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          componentId,
          state.customComponents,
        )

        if (isCustomComponentChild) {
          const exposedPropIndex = draftState.customComponentsProps.findIndex(
            prop => prop.componentId === componentId && prop.name === propName,
          )
          const derivedFromPropName =
            draftState.customComponentsProps[exposedPropIndex]
              .derivedFromPropName
          const customComponentType =
            draftState.customComponentsProps[exposedPropIndex]
              .derivedFromComponentType

          draftState.customComponentsProps[
            exposedPropIndex
          ].derivedFromPropName = null
          draftState.customComponentsProps[
            exposedPropIndex
          ].derivedFromComponentType = null

          // delete the prop in all the instances of custom components
          // only when there is no other children inside the root custom component uses the custom prop
          const checkExposedPropInstance = draftState.customComponentsProps.findIndex(
            prop =>
              prop.derivedFromComponentType === customComponentType &&
              prop.derivedFromPropName === derivedFromPropName,
          )
          if (checkExposedPropInstance === -1) {
            Object.values(draftState.componentsById[componentsId])
              .filter(component => component.type === customComponentType)
              .forEach(component => {
                const index = draftState.propsById[propsId].findIndex(
                  prop =>
                    prop.name === derivedFromPropName &&
                    prop.componentId === component.id,
                )
                draftState.propsById[propsId].splice(index, 1)
              })
            Object.values(draftState.customComponents)
              .filter(component => component.type === customComponentType)
              .forEach(component => {
                const index = draftState.customComponentsProps.findIndex(
                  prop =>
                    prop.name === derivedFromPropName &&
                    prop.componentId === component.id,
                )
                draftState.customComponentsProps.splice(index, 1)
              })
          }
        } else {
          //update only the derivedFromPropName of the exposed prop if it is not a child of custom component
          const exposedPropIndex = draftState.propsById[propsId].findIndex(
            prop => prop.componentId === componentId && prop.name === propName,
          )

          draftState.propsById[propsId][
            exposedPropIndex
          ].derivedFromPropName = null
        }
      })
    },
    deleteCustomProp(
      state: ComponentsState,
      propName: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const propsId = state.pages[state.selectedPage].propsId
        const componentsId = state.pages[state.selectedPage].componentsId
        const componentType =
          draftState.componentsById[componentsId][componentId].type

        // delete the prop in all the instances of custom components
        Object.values(draftState.componentsById[componentsId])
          .filter(component => component.type === componentType)
          .forEach(component => {
            const index = draftState.propsById[propsId].findIndex(
              prop =>
                prop.name === propName && prop.componentId === component.id,
            )
            draftState.propsById[propsId].splice(index, 1)
          })
        Object.values(draftState.customComponents)
          .filter(component => component.type === componentType)
          .forEach(component => {
            const index = draftState.customComponentsProps.findIndex(
              prop =>
                prop.name === propName && prop.componentId === component.id,
            )
            draftState.customComponentsProps.splice(index, 1)
          })

        //un-expose the props whose value is derived from the prop that is deleted.
        draftState.customComponentsProps
          .filter(
            prop =>
              prop.derivedFromComponentType === componentType &&
              prop.derivedFromPropName === propName,
          )
          .forEach((_, index) => {
            draftState.customComponentsProps[index].derivedFromPropName = null
            draftState.customComponentsProps[
              index
            ].derivedFromComponentType = null
          })
      })
    },
    deleteCustomComponent(
      state: ComponentsState,
      type: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        console.log('deleted')
      })
    },
  },
})

export default components
