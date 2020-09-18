import { createModel } from '@rematch/core'
import produce from 'immer'
import { generateId } from '../../utils/generateId'
import { DEFAULT_PROPS } from '../../utils/defaultProps'
import {
  deleteComp,
  fetchAndUpdateExposedProps,
  moveComponent,
  searchRootCustomComponent,
  duplicateComponent,
  deleteCustomProp,
} from '../../utils/recursive'
import _ from 'lodash'
import {
  addSpanForSelection,
  removeSpanForSelection,
} from '../../utils/selectionUtility'

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
export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

const DEFAULT_ID = 'root'

const DEFAULT_PAGE = 'app'

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

export const isKeyForComponent = (value: string, components: IComponents) => {
  if (components[value]) return true
  return false
}

const splitArray = (payload: {
  stringValue: string
  start: number
  end: number
  id: string
}) => {
  let splittedArray = []

  const { start, stringValue, end, id } = payload

  if (start === 0 && end === stringValue.length) splittedArray = [id]
  else if (start === 0 && end !== stringValue.length)
    splittedArray = [id, stringValue.substring(end, stringValue.length)]
  else if (end === stringValue.length && start !== 0)
    splittedArray = [stringValue.substring(0, start), id]
  else
    splittedArray = [
      stringValue.substring(0, start),
      id,
      stringValue.substring(end, stringValue.length),
    ]

  return splittedArray
}

export const updateInAllInstances = (
  pages: IPages,
  componentsById: IComponentsById,
  customComponents: IComponents,
  typeToFilter: string,
  updateCallBack: any,
) => {
  Object.values(pages).forEach(page =>
    Object.values(componentsById[page.componentsId])
      .filter(component => component.type === typeToFilter)
      .forEach(component =>
        updateCallBack(component, false, page.propsId, page.componentsId),
      ),
  )

  Object.values(customComponents)
    .filter(component => component.type === typeToFilter)
    .forEach(component => updateCallBack(component, true))
}

// joining the adjacent text in the array
const joinAdjacentTextNodes = (
  childrenPropIndex: number,
  components: IComponents,
  props: IProp[],
) => {
  const propValue: string[] = []

  props[childrenPropIndex].value.forEach((val: string) => {
    if (propValue.length === 0 || isKeyForComponent(val, components)) {
      propValue.push(val)
    } else {
      if (!isKeyForComponent(propValue[propValue.length - 1], components)) {
        propValue[propValue.length - 1] = propValue[propValue.length - 1] + val
      } else {
        propValue.push(val)
      }
    }
  })
  return propValue
}

const deleteCustomPropUtility = (
  component: IComponent,
  propName: string,
  components: IComponents,
  props: IProp[],
) => {
  const index = props.findIndex(
    prop => prop.name === propName && prop.componentId === component.id,
  )
  const customProp = props[index]
  props.splice(index, 1)

  if (component.id !== component.type) {
    // Wrapper-components
    if (customProp.name === 'children') {
      components[component.id].children.length > 0 &&
        components[component.id].children.forEach(child => {
          const { updatedComponents, updatedProps } = deleteComp(
            components[child],
            components,
            props,
          )
          return {
            props: updatedProps,
            components: updatedComponents,
          }
        })
      components[component.id].children = []
    }
    // Layout-components
    if (components[customProp.value]) {
      const { updatedComponents, updatedProps } = deleteComp(
        components[customProp.value],
        components,
        props,
      )

      return {
        props: updatedProps,
        components: updatedComponents,
      }
    }
  }
  return {
    props: props,
    components: components,
  }
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
        const { id, name, value } = payload

        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )
        const propsId = draftState.pages[draftState.selectedPage].propsId

        let props = isCustomComponentChild
          ? draftState.customComponentsProps
          : draftState.propsById[propsId]

        //If the prop is already found, update the prop value or else add the prop.
        const existingPropIndex = props.findIndex(
          prop => prop.componentId === id && prop.name === name,
        )

        if (existingPropIndex !== -1) {
          props[existingPropIndex].value = value
        } else
          props.push({
            id: generateId(),
            name: name,
            value: value,
            componentId: id,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          })
      })
    },
    exposeProp(
      state: ComponentsState,
      payload: { name: string; targetedProp: string },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        let { name } = payload
        const { targetedProp } = payload

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

          //Check for existing prop in root parent.
          const isCustomPropPresent =
            draftState.customComponentsProps.findIndex(
              prop =>
                prop.componentId === rootCustomParent && prop.name === name,
            ) !== -1
          let samePropName = ''

          if (isCustomPropPresent && name !== 'children') {
            samePropName =
              window
                .prompt(
                  'The root parent already has the similar prop name. To continue with the same propName , type yes else type no',
                )
                ?.toLowerCase() || 'yes'
            if (samePropName === 'no') {
              name =
                window.prompt('Enter the new prop name for the exposed prop') ||
                name
            }
          }

          let propValue = ''

          //expose it when the prop is already added or else add the prop and then expose
          const propIndex = draftState.customComponentsProps.findIndex(
            prop =>
              prop.componentId === componentId && prop.name === targetedProp,
          )

          if (propIndex !== -1) {
            propValue = draftState.customComponentsProps[propIndex].value

            draftState.customComponentsProps[
              propIndex
            ].derivedFromComponentType =
              state.customComponents[rootCustomParent].type

            draftState.customComponentsProps[
              propIndex
            ].derivedFromPropName = name
          } else {
            //Add the exposed prop in the custom props
            draftState.customComponentsProps.push({
              id: generateId(),
              name: targetedProp,
              value: propValue,
              componentId,
              derivedFromPropName: name,
              derivedFromComponentType:
                state.customComponents[rootCustomParent].type,
            })
          }

          //Add props for all the instances of the custom components only when there is no similar prop present or there is change in prop-name
          if (!isCustomPropPresent || samePropName === 'no')
            updateInAllInstances(
              draftState.pages,
              draftState.componentsById,
              draftState.customComponents,
              draftState.customComponents[rootCustomParent].type,
              (
                component: IComponent,
                updateInCustomComponent: Boolean,
                propsId: string,
                componentsId: string,
              ) => {
                const id = generateId()

                if (
                  targetedProp === 'children' &&
                  (draftState.customComponents[componentId].type === 'Box' ||
                    draftState.customComponents[componentId].type === 'Flex') &&
                  name !== 'children'
                ) {
                  propValue = id
                }
                const prop = {
                  id: generateId(),
                  name: name,
                  value: propValue,
                  componentId: component.id,
                  derivedFromPropName: null,
                  derivedFromComponentType: null,
                }

                const heightProp = {
                  id: generateId(),
                  name: 'height',
                  value: '100%',
                  componentId: '',
                  derivedFromPropName: null,
                  derivedFromComponentType: null,
                }

                const boxComponent = {
                  id,
                  type: 'Box',
                  parent: 'Prop',
                  children: [],
                }

                if (updateInCustomComponent) {
                  draftState.customComponentsProps.push(prop)
                  if (targetedProp === 'children' && name !== 'children') {
                    draftState.customComponents[id] = boxComponent
                    draftState.customComponentsProps.push({
                      ...heightProp,
                      componentId: id,
                    })
                  }
                } else {
                  draftState.propsById[propsId].push(prop)
                  if (targetedProp === 'children' && name !== 'children') {
                    draftState.componentsById[componentsId][id] = boxComponent
                    draftState.propsById[propsId].push({
                      ...heightProp,
                      componentId: id,
                    })
                  }
                }
              },
            )
        } else {
          const propIndex = draftState.propsById[propsId].findIndex(
            prop =>
              prop.componentId === componentId && prop.name === targetedProp,
          )

          //expose it when the prop is already added or else add the prop and then expose
          if (propIndex !== -1)
            draftState.propsById[propsId][propIndex].derivedFromPropName = name
          else {
            draftState.propsById[propsId].push({
              id: generateId(),
              name: targetedProp,
              value: '',
              componentId,
              derivedFromPropName: name,
              derivedFromComponentType: null,
            })
          }
        }
      })
    },
    deleteProps(state: ComponentsState, payload: { id: string; name: string }) {
      return produce(state, (draftState: ComponentsState) => {
        const { id, name } = payload
        const propsId = draftState.pages[draftState.selectedPage].propsId
        if (checkIsChildOfCustomComponent(id, draftState.customComponents)) {
          const index = draftState.customComponentsProps.findIndex(
            prop => prop.componentId === id && prop.name === name,
          )
          draftState.customComponentsProps.splice(index, 1)
        } else {
          const index = draftState.propsById[propsId].findIndex(
            prop => prop.componentId === id && prop.name === name,
          )
          draftState.propsById[propsId].splice(index, 1)
        }
      })
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
        const parentId = components[componentId].parent

        if (parentId === 'Prop') return state

        //Can not delete the immediate(outermost) children of custom component
        if (isCustomComponentChild && components[parentId].parent.length === 0)
          return state

        const propsId = draftState.pages[draftState.selectedPage].propsId
        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const { updatedComponents, updatedProps, deletedProps } = deleteComp(
          components[componentId],
          components,
          props,
        )
        updatedComponents[parentId].children = updatedComponents[
          parentId
        ].children.filter(child => child !== componentId)

        if (updatedComponents[parentId].type === 'Text') {
          const childrenPropIndex = updatedProps.findIndex(
            prop => prop.componentId === parentId && prop.name === 'children',
          )
          updatedProps[childrenPropIndex].value = updatedProps[
            childrenPropIndex
          ].value.filter((val: string) => val !== componentId)

          const propValue = joinAdjacentTextNodes(
            childrenPropIndex,
            components,
            props,
          )
          updatedProps[childrenPropIndex].value = propValue
        }

        draftState.selectedId = DEFAULT_ID
        if (isCustomComponentChild) {
          draftState.customComponents = updatedComponents
          draftState.customComponentsProps = updatedProps

          //deletion of custom props for the exposed props that are deleted
          deletedProps
            .filter(prop => prop.derivedFromPropName)
            .forEach(customProp => {
              const {
                updatedCustomComponentProps,
                updatedPropsById,
                updatedComponentsById,
                updatedCustomComponents,
              } = deleteCustomProp(
                customProp,
                draftState.pages,
                draftState.componentsById,
                draftState.customComponents,
                draftState.propsById,
                draftState.customComponentsProps,
              )
              draftState.propsById = { ...updatedPropsById }
              draftState.customComponentsProps = [
                ...updatedCustomComponentProps,
              ]
              draftState.componentsById = { ...updatedComponentsById }
              draftState.customComponents = { ...updatedCustomComponents }
            })
        } else {
          draftState.propsById[propsId] = [...updatedProps]
          draftState.componentsById[componentsId] = { ...updatedComponents }

          deletedProps
            .filter(prop => draftState.componentsById[componentsId][prop.value])
            .forEach(prop => {
              const { updatedComponents, updatedProps } = deleteComp(
                draftState.componentsById[componentsId][prop.value],
                draftState.componentsById[componentsId],
                draftState.propsById[propsId],
              )
              draftState.propsById[propsId] = [...updatedProps]
              draftState.componentsById[componentsId] = { ...updatedComponents }
            })
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
        const props = checkIsChildOfCustomComponent(
          componentId,
          draftState.customComponents,
        )
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]
        const asPropIndex = props.findIndex(
          prop => prop.componentId === componentId && prop.name === 'as',
        )

        //It should not be moved if it is a span element
        if (asPropIndex !== -1) return state

        if (
          checkIsChildOfCustomComponent(componentId, state.customComponents)
        ) {
          const oldParentId = draftState.customComponents[componentId].parent

          if (oldParentId === 'Prop') return state

          //can not be moved into the same parent
          if (newParentId === oldParentId) return state

          //Can not move the immediate(outermost) children of custom component
          if (draftState.customComponents[oldParentId].parent.length === 0)
            return state

          draftState.customComponents[componentId].parent = newParentId

          //remove the componentId from children of old parent
          draftState.customComponents[oldParentId].children.splice(
            draftState.customComponents[oldParentId].children.indexOf(
              componentId,
            ),
            1,
          )
          const {
            updatedSourceComponents: updatedCustomComponents,
            updatedSourceProps: updatedCustomComponentProps,
            movedProps,
            movedComponents,
          } = moveComponent(
            componentId,
            draftState.customComponents,
            draftState.customComponentsProps,
          )

          //moved from custom component to another custom component
          if (
            checkIsChildOfCustomComponent(newParentId, state.customComponents)
          ) {
            //Add the componentId in the children of new parent
            draftState.customComponents[newParentId].children.push(componentId)

            //When moved from one custom component to another custom component
            //The custom prop should be deleted from the old root parent and must be updated in the new root parent.
            const rootCustomParent = searchRootCustomComponent(
              draftState.customComponents[newParentId],
              draftState.customComponents,
            )

            movedProps
              .filter(
                prop =>
                  prop.derivedFromPropName && prop.derivedFromComponentType,
              )
              .forEach(customProp => {
                //An copy of exposed prop before changing the derived from component-id
                const customPropCopy = { ...customProp }
                const index = draftState.customComponentsProps.findIndex(
                  prop_ => prop_.id === customProp.id,
                )

                draftState.customComponentsProps[
                  index
                ].derivedFromComponentType = rootCustomParent

                const {
                  updatedCustomComponentProps,
                  updatedPropsById,
                  updatedComponentsById,
                  updatedCustomComponents,
                } = deleteCustomProp(
                  customPropCopy,
                  draftState.pages,
                  draftState.componentsById,
                  draftState.customComponents,
                  draftState.propsById,
                  draftState.customComponentsProps,
                )
                draftState.propsById = { ...updatedPropsById }
                draftState.customComponentsProps = [
                  ...updatedCustomComponentProps,
                ]
                draftState.componentsById = { ...updatedComponentsById }
                draftState.customComponents = { ...updatedCustomComponents }
                const isCustomPropPresent = draftState.customComponentsProps.findIndex(
                  prop =>
                    prop.componentId === rootCustomParent &&
                    prop.name === customProp.derivedFromPropName,
                )

                if (isCustomPropPresent === -1) {
                  updateInAllInstances(
                    draftState.pages,
                    draftState.componentsById,
                    draftState.customComponents,
                    draftState.customComponents[rootCustomParent].type,
                    (
                      component: IComponent,
                      updateInCustomComponent: Boolean,
                      propsId: string,
                    ) => {
                      const boxId = generateId()
                      const isChildrenPropOfBox =
                        customProp.name === 'children' &&
                        draftState.customComponents[customProp.componentId].type
                      const prop = {
                        id: generateId(),
                        name: customProp.derivedFromPropName || '',
                        value: isChildrenPropOfBox ? boxId : customProp.value,
                        componentId: component.id,
                        derivedFromPropName: null,
                        derivedFromComponentType: null,
                      }
                      const boxComponent = {
                        id: boxId,
                        type: 'Box',
                        parent: 'Prop',
                        children: [],
                      }
                      if (updateInCustomComponent) {
                        draftState.customComponentsProps.push(prop)
                        if (isChildrenPropOfBox)
                          draftState.customComponents[boxId] = boxComponent
                      } else {
                        draftState.propsById[propsId].push(prop)
                        if (isChildrenPropOfBox)
                          draftState.componentsById[componentsId][
                            boxId
                          ] = boxComponent
                      }
                    },
                  )
                }
              })
          }
          //moved from custom component to components data
          else {
            draftState.componentsById[componentsId] = {
              ...draftState.componentsById[componentsId],
              ...movedComponents,
            }
            draftState.customComponents = { ...updatedCustomComponents }
            draftState.componentsById[componentsId][
              componentId
            ].parent = newParentId
            //Add the componentId in the children of new parent
            draftState.componentsById[componentsId][newParentId].children.push(
              componentId,
            )

            //update the derivedFromComponentType to null for the moved props.
            draftState.propsById[propsId] = [
              ...draftState.propsById[propsId],
              ...movedProps.map(prop => {
                if (prop.derivedFromPropName && prop.derivedFromComponentType)
                  return { ...prop, derivedFromComponentType: null }
                return prop
              }),
            ]

            draftState.customComponentsProps = [...updatedCustomComponentProps]

            //deletion of custom props for all the exposed props.
            movedProps
              .filter(prop => prop.derivedFromPropName)
              .forEach(customProp => {
                const {
                  updatedCustomComponentProps,
                  updatedPropsById,
                  updatedComponentsById,
                  updatedCustomComponents,
                } = deleteCustomProp(
                  customProp,
                  draftState.pages,
                  draftState.componentsById,
                  draftState.customComponents,
                  draftState.propsById,
                  draftState.customComponentsProps,
                )
                draftState.propsById = { ...updatedPropsById }
                draftState.customComponentsProps = [
                  ...updatedCustomComponentProps,
                ]
                draftState.componentsById = { ...updatedComponentsById }
                draftState.customComponents = { ...updatedCustomComponents }
              })
          }
        } else {
          const oldParentId =
            draftState.componentsById[componentsId][componentId].parent

          if (oldParentId === 'Prop') return state

          //can not be moved into the same parent
          if (newParentId === oldParentId) return state
          const isCustomComponentChild = checkIsChildOfCustomComponent(
            newParentId,
            state.customComponents,
          )

          //moved from components data to the custom component
          if (isCustomComponentChild) {
            const rootCustomParent = searchRootCustomComponent(
              draftState.customComponents[newParentId],
              draftState.customComponents,
            )

            //one instance of custom component can not be moved into another instance of same custom component
            if (
              draftState.customComponents[rootCustomParent].type ===
              draftState.componentsById[componentsId][componentId].type
            )
              return state

            //remove the componentId from children of old parent
            draftState.componentsById[componentsId][
              oldParentId
            ].children.splice(
              draftState.componentsById[componentsId][
                oldParentId
              ].children.indexOf(componentId),
              1,
            )

            const {
              updatedSourceComponents: updatedComponents,
              updatedSourceProps: updatedProps,
              movedComponents,
              movedProps,
            } = moveComponent(
              componentId,
              draftState.componentsById[componentsId],
              draftState.propsById[propsId],
            )
            draftState.componentsById[componentsId] = { ...updatedComponents }
            draftState.customComponents = {
              ...draftState.customComponents,
              ...movedComponents,
            }
            draftState.customComponents[componentId].parent = newParentId
            //Add the componentId in the children of new parent
            draftState.customComponents[newParentId].children.push(componentId)

            draftState.propsById[propsId] = [...updatedProps]
            draftState.customComponentsProps = [
              ...draftState.customComponentsProps,
              ...movedProps.map(prop => {
                if (prop.derivedFromPropName)
                  return { ...prop, derivedFromComponentType: rootCustomParent }
                return prop
              }),
            ]

            //Add custom props for all the instances of the custom components only when there is no similar prop present
            //Also add the box if the children for the box component is exposed.
            movedProps
              .filter(prop => prop.derivedFromPropName)
              .forEach(customProp => {
                const isPropPresent = draftState.customComponentsProps.findIndex(
                  prop =>
                    prop.componentId === rootCustomParent &&
                    prop.name === customProp.derivedFromPropName,
                )
                if (isPropPresent === -1) {
                  updateInAllInstances(
                    draftState.pages,
                    draftState.componentsById,
                    draftState.customComponents,
                    draftState.customComponents[rootCustomParent].type,
                    (
                      component: IComponent,
                      updateInCustomComponent: Boolean,
                      propsId: string,
                      componentsId: string,
                    ) => {
                      const boxId = generateId()
                      const isChildrenPropOfBox =
                        customProp.name === 'children' &&
                        draftState.customComponents[customProp.componentId].type
                      const prop = {
                        id: generateId(),
                        name: customProp.derivedFromPropName || '',
                        value: isChildrenPropOfBox ? boxId : customProp.value,
                        componentId: component.id,
                        derivedFromPropName: null,
                        derivedFromComponentType: null,
                      }
                      const boxComponent = {
                        id: boxId,
                        type: 'Box',
                        parent: 'Prop',
                        children: [],
                      }
                      if (updateInCustomComponent) {
                        draftState.customComponentsProps.push(prop)
                        if (isChildrenPropOfBox)
                          draftState.customComponents[boxId] = boxComponent
                      } else {
                        draftState.propsById[propsId].push(prop)
                        if (isChildrenPropOfBox)
                          draftState.componentsById[componentsId][
                            boxId
                          ] = boxComponent
                      }
                    },
                  )
                }
              })
          }

          //moved inside the components data
          else {
            //remove the componentId from children of old parent
            draftState.componentsById[componentsId][
              oldParentId
            ].children.splice(
              draftState.componentsById[componentsId][
                oldParentId
              ].children.indexOf(componentId),
              1,
            )
            draftState.componentsById[componentsId][
              componentId
            ].parent = newParentId

            //Add the componentId in the children of new parent
            draftState.componentsById[componentsId][newParentId].children.push(
              componentId,
            )
          }
        }
        draftState.selectedId = componentId
      })
    },
    moveSelectedComponentChildren(
      state: ComponentsState,
      payload: { componentId: string; fromIndex: number; toIndex: number },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId

        const { componentId, fromIndex, toIndex } = payload

        const selectedComponent = checkIsChildOfCustomComponent(
          componentId,
          state.customComponents,
        )
          ? draftState.customComponents[componentId]
          : draftState.componentsById[componentsId][componentId]

        selectedComponent.children.splice(
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

        //Add the default props for the component.
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
            children: [],
          }
          draftState.customComponents[payload.parentName].children.push(id)
          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...props,
          ]
        } else {
          draftState.componentsById[componentsId][id] = {
            id,
            type: payload.type,
            parent: payload.parentName,
            children: [],
          }
          draftState.componentsById[componentsId][
            payload.parentName
          ].children.push(id)
          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...props,
          ]
        }
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

        //The custom component can not be added to its own instance
        if (isCustomComponentChild) {
          const rootCustomParent = searchRootCustomComponent(
            draftState.customComponents[parentId],
            draftState.customComponents,
          )
          if (draftState.customComponents[rootCustomParent].type === type)
            return state
        }

        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId

        const propsId = draftState.pages[draftState.selectedPage].propsId

        const customComponentsProps = [...state.customComponentsProps]

        const duplicatedProps = duplicateProps(
          customComponentsProps.filter(prop => prop.componentId === type),
          id,
        )

        const heightProp = {
          id: generateId(),
          name: 'height',
          value: '100%',
          componentId: '',
          derivedFromPropName: null,
          derivedFromComponentType: null,
        }
        if (isCustomComponentChild) {
          draftState.customComponents[id] = {
            id,
            type: payload.type,
            parent: parentId,
            children: [],
          }
          draftState.customComponents[parentId].children.push(id)

          duplicatedProps.forEach((prop, index) => {
            if (draftState.customComponents[prop.value]) {
              const id = generateId()
              draftState.customComponents[id] = {
                id,
                type: 'Box',
                parent: 'Prop',
                children: [],
              }
              draftState.customComponentsProps.push({
                ...heightProp,
                componentId: id,
              })
              duplicatedProps[index].value = id
            }
          })
          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...duplicatedProps,
          ]
        } else {
          draftState.componentsById[componentsId][id] = {
            id,
            type: payload.type,
            parent: parentId,
            children: [],
          }
          draftState.componentsById[componentsId][parentId].children.push(id)

          duplicatedProps.forEach((prop, index) => {
            if (draftState.customComponents[prop.value]) {
              const id = generateId()
              draftState.componentsById[componentsId][id] = {
                id,
                type: 'Box',
                parent: 'Prop',
                children: [],
              }
              draftState.propsById[propsId].push({
                ...heightProp,
                componentId: id,
              })
              duplicatedProps[index].value = id
            }
          })

          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...duplicatedProps,
          ]
        }
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

        //Add the default props for the components
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
          draftState.customComponents[parent].children.push(root)
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
          draftState.componentsById[componentsId][parent].children.push(root)
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
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const isChildOfCustomComponent = checkIsChildOfCustomComponent(
          draftState.selectedId,
          draftState.customComponents,
        )
        let components = isChildOfCustomComponent
          ? { ...draftState.customComponents }
          : { ...draftState.componentsById[componentsId] }

        const selectedComponent = components[draftState.selectedId]

        if (selectedComponent.parent === 'Prop') return state

        //Can not duplicate the immediate(outermost) children of custom component
        if (
          isChildOfCustomComponent &&
          components[selectedComponent.parent].parent.length === 0
        )
          return state

        let props = isChildOfCustomComponent
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const { newId, clonedComponents, clonedProps } = duplicateComponent(
          selectedComponent,
          components,
          props,
        )
        const childrenPropIndex = props.findIndex(
          prop =>
            prop.componentId === selectedComponent.parent &&
            prop.name === 'children',
        )
        if (isChildOfCustomComponent) {
          draftState.customComponents = {
            ...draftState.customComponents,
            ...clonedComponents,
          }

          draftState.customComponentsProps = [
            ...draftState.customComponentsProps,
            ...clonedProps,
          ]
          draftState.customComponents[selectedComponent.parent].children.push(
            newId,
          )

          draftState.customComponents[selectedComponent.parent].type ===
            'Text' &&
            draftState.customComponentsProps[childrenPropIndex].value.push(
              newId,
            )
        } else {
          draftState.componentsById[componentsId] = {
            ...draftState.componentsById[componentsId],
            ...clonedComponents,
          }

          draftState.propsById[propsId] = [
            ...draftState.propsById[propsId],
            ...clonedProps,
          ]
          draftState.componentsById[componentsId][
            selectedComponent.parent
          ].children.push(newId)

          draftState.componentsById[componentsId][selectedComponent.parent]
            .type === 'Text' &&
            draftState.propsById[propsId][childrenPropIndex].value.push(newId)
        }
      })
    },
    saveComponent(state: ComponentsState, name: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentId = draftState.selectedId
        const newId = generateId()

        const componentsId = state.pages[state.selectedPage].componentsId
        const propsId = state.pages[state.selectedPage].propsId
        const parentId =
          draftState.componentsById[componentsId][componentId].parent

        if (parentId === 'Prop') return state

        //move the component from the components data to custom components data
        //move the component props from propsId to custom components props

        const {
          updatedSourceComponents: updatedComponents,
          updatedSourceProps: updatedProps,
          movedComponents,
          movedProps,
        } = moveComponent(
          componentId,
          draftState.componentsById[componentsId],
          draftState.propsById[propsId],
        )

        //Add the outer container in both components(instance) and custom components(original)
        draftState.componentsById[componentsId] = {
          ...updatedComponents,
          [newId]: {
            id: newId,
            type: name,
            parent: parentId,
            children: [],
          },
        }
        const index = draftState.componentsById[componentsId][
          parentId
        ].children.findIndex(child => child === componentId)

        draftState.componentsById[componentsId][parentId].children.splice(
          index,
          1,
          newId,
        )

        draftState.customComponents = {
          ...draftState.customComponents,
          ...movedComponents,
          [name]: {
            id: name,
            type: name,
            parent: '',
            children: [componentId],
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
          [...draftState.customComponentsProps, ...movedProps],
        )
        //make a duplicate props for the instance of the custom component.
        const duplicatedProps = duplicateProps(rootParentProps, newId)

        //Add the box component if any value is the key for the components(custom children prop)

        rootParentProps.forEach((prop, index) => {
          if (prop.value === 'Root') {
            const id = generateId()
            draftState.customComponents[id] = {
              id,
              type: 'Box',
              parent: 'Prop',
              children: [],
            }
            rootParentProps[index].value = id
          }
        })
        duplicatedProps.forEach((prop, index) => {
          if (prop.value === 'Root') {
            const id = generateId()
            draftState.componentsById[componentsId][id] = {
              id,
              type: 'Box',
              parent: 'Prop',
              children: [],
            }
            duplicatedProps[index].value = id
          }
        })
        draftState.propsById[propsId] = [...updatedProps, ...duplicatedProps]
        draftState.customComponentsProps = [...customProps, ...rootParentProps]
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
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const components = draftState.componentsById[componentsId]
        const props = draftState.propsById[propsId]
        const { newId, clonedComponents, clonedProps } = duplicateComponent(
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
        const componentId = draftState.selectedId
        const propName = targetedProp
        const propsId = state.pages[state.selectedPage].propsId
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          componentId,
          state.customComponents,
        )

        if (isCustomComponentChild) {
          const exposedPropIndex = draftState.customComponentsProps.findIndex(
            prop => prop.componentId === componentId && prop.name === propName,
          )

          const customProp = {
            ...draftState.customComponentsProps[exposedPropIndex],
          }

          //If the value is empty, delete the prop.
          //else old value before exposing will be retained.
          if (
            draftState.customComponentsProps[exposedPropIndex].value.length ===
            0
          )
            draftState.customComponentsProps.splice(exposedPropIndex, 1)
          else {
            draftState.customComponentsProps[
              exposedPropIndex
            ].derivedFromPropName = null
            draftState.customComponentsProps[
              exposedPropIndex
            ].derivedFromComponentType = null
          }

          const {
            updatedCustomComponentProps,
            updatedPropsById,
            updatedCustomComponents,
            updatedComponentsById,
          } = deleteCustomProp(
            customProp,
            draftState.pages,
            draftState.componentsById,
            draftState.customComponents,
            draftState.propsById,
            draftState.customComponentsProps,
          )

          draftState.customComponentsProps = [...updatedCustomComponentProps]
          draftState.propsById = { ...updatedPropsById }
          draftState.componentsById = { ...updatedComponentsById }
          draftState.customComponents = { ...updatedCustomComponents }
        } else {
          //update only the derivedFromPropName of the exposed prop if it is not a child of custom component
          const exposedPropIndex = draftState.propsById[propsId].findIndex(
            prop => prop.componentId === componentId && prop.name === propName,
          )

          //If the value is empty, delete the prop.
          //else old value before exposing will be retained.
          if (
            draftState.propsById[propsId][exposedPropIndex].value.length === 0
          )
            draftState.propsById[propsId].splice(exposedPropIndex, 1)
          else
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
        const currentComponentsId = state.pages[state.selectedPage].componentsId
        const componentType = checkIsChildOfCustomComponent(
          componentId,
          draftState.customComponents,
        )
          ? draftState.customComponents[componentId].type
          : draftState.componentsById[currentComponentsId][componentId].type

        // delete the prop in all the instances of custom components

        updateInAllInstances(
          draftState.pages,
          draftState.componentsById,
          draftState.customComponents,
          componentType,
          (
            component: IComponent,
            updateInCustomComponent: Boolean,
            propsId: string,
            componentsId: string,
          ) => {
            if (updateInCustomComponent) {
              const { props, components } = deleteCustomPropUtility(
                component,
                propName,
                draftState.customComponents,
                draftState.customComponentsProps,
              )
              draftState.customComponents = { ...components }
              draftState.customComponentsProps = [...props]
            } else {
              const { props, components } = deleteCustomPropUtility(
                component,
                propName,
                draftState.componentsById[componentsId],
                draftState.propsById[propsId],
              )
              draftState.componentsById[componentsId] = { ...components }
              draftState.propsById[propsId] = [...props]
            }
          },
        )

        //un-expose the props whose value is derived from the prop that is deleted.
        //In order to find the index, we can not use the filter method here.
        draftState.customComponentsProps.forEach((prop, index) => {
          if (
            prop.derivedFromComponentType === componentType &&
            prop.derivedFromPropName === propName
          ) {
            //Remove the prop if its value is empty
            if (prop.value.length === 0) {
              draftState.customComponentsProps.splice(index, 1)
            } else {
              draftState.customComponentsProps[index].derivedFromPropName = null
              draftState.customComponentsProps[
                index
              ].derivedFromComponentType = null
            }
          }
        })
      })
    },
    deleteCustomComponent(
      state: ComponentsState,
      type: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const { updatedComponents, updatedProps, deletedProps } = deleteComp(
          draftState.customComponents[type],
          draftState.customComponents,
          draftState.customComponentsProps,
        )
        draftState.customComponents = { ...updatedComponents }
        draftState.customComponentsProps = [...updatedProps]
        deletedProps
          .filter(prop => draftState.customComponents[prop.value])
          .forEach(prop => {
            const { updatedComponents, updatedProps } = deleteComp(
              draftState.customComponents[prop.value],
              draftState.customComponents,
              draftState.customComponentsProps,
            )
            draftState.customComponentsProps = [...updatedProps]
            draftState.customComponents = { ...updatedComponents }
          })
      })
    },
    updateTextChildrenProp(
      state: ComponentsState,
      payload: {
        id: string
        value:
          | string
          | Array<{
              type: string
              value: string
              componentId?: string
            }>
      },
    ) {
      return produce(state, (draftState: ComponentsState) => {
        const { id, value } = payload

        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId

        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const components = isCustomComponentChild
          ? draftState.customComponents
          : draftState.componentsById[componentsId]

        const childrenPropIndex = props.findIndex(
          prop => prop.componentId === id && prop.name === 'children',
        )
        const childrenProp = props[childrenPropIndex]

        const nodeValue = Array.isArray(value)
          ? value.map((val: any) => val.value)
          : value

        const oldPropValue = Array.isArray(childrenProp.value)
          ? childrenProp.value.map((val: string) => {
              if (isKeyForComponent(val, components)) {
                const spanChildrenProp = props.find(
                  prop => prop.name === 'children' && prop.componentId === val,
                )
                return spanChildrenProp?.value
              } else return val
            })
          : childrenProp.value

        // delete old value and add new value only when there is a change in the value
        if (JSON.stringify(nodeValue) === JSON.stringify(oldPropValue)) return

        const spanComponentsToBeDeleted = Array.isArray(childrenProp.value)
          ? childrenProp.value.filter(val => isKeyForComponent(val, components))
          : []

        if (Array.isArray(value)) {
          const propArray: string[] = []
          const children: string[] = []
          value.forEach(
            (
              val: {
                type: string
                value: string
                componentId?: string
              },
              index,
            ) => {
              if (val.type === 'SPAN' && val.componentId) {
                const index = spanComponentsToBeDeleted.indexOf(val.componentId)
                spanComponentsToBeDeleted.splice(index, 1)

                const spanChildrenPropIndex = props.findIndex(
                  prop =>
                    prop.componentId === val.componentId &&
                    prop.name === 'children',
                )
                props[spanChildrenPropIndex].value = val.value
                propArray.push(val.componentId)
                children.push(val.componentId)
              } else {
                if (index > 0 && value[index - 1].type !== 'SPAN')
                  propArray[index - 1] = propArray[index - 1] + val.value
                else propArray.push(val.value)
              }
            },
          )
          props[childrenPropIndex].value = propArray
          components[id].children = children
        } else {
          props[childrenPropIndex].value = value
        }

        //Remove the un-necessary components.
        spanComponentsToBeDeleted.forEach((val: string) => {
          props = props.filter(prop => prop.componentId !== val)
          delete components[val]
        })

        if (isCustomComponentChild) draftState.customComponentsProps = props
        else draftState.propsById[propsId] = props
      })
    },
    addSpanComponent(
      state,
      payload: {
        startIndex: number
        endIndex: number
        startNodePosition: number
        endNodePosition: number
      },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const id = draftState.selectedId
        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )
        const components = isCustomComponentChild
          ? draftState.customComponents
          : draftState.componentsById[componentsId]

        const props = isCustomComponentChild
          ? draftState.customComponentsProps
          : draftState.propsById[propsId]

        const childrenPropIndex = props.findIndex(
          prop => prop.name === 'children' && prop.componentId === id,
        )
        const newId = generateId()
        const {
          startIndex,
          endIndex,
          startNodePosition,
          endNodePosition,
        } = payload
        let start = startIndex
        let end = endIndex

        let croppedValue = ''

        //Only text node.
        if (startNodePosition === endNodePosition) {
          //  selected the text from right to left
          if (startIndex > endIndex) {
            start = endIndex
            end = startIndex
          }
          components[newId] = {
            id: newId,
            type: 'Box',
            children: [],
            parent: id,
          }

          components[id].children.push(newId)

          props.push({
            id: generateId(),
            componentId: newId,
            value: 'span',
            name: 'as',
            derivedFromComponentType: null,
            derivedFromPropName: null,
          })

          croppedValue = props[childrenPropIndex].value[
            startNodePosition
          ].substring(start, end)

          props[childrenPropIndex].value[startNodePosition] = splitArray({
            stringValue: props[childrenPropIndex].value[startNodePosition],
            start,
            end,
            id: newId,
          })

          props[childrenPropIndex].value = _.flatten(
            props[childrenPropIndex].value,
          )
        }
        //Combination of text node and span node.
        else {
          addSpanForSelection(childrenPropIndex, props, components, {
            start,
            end,
            endNodePosition,
            startNodePosition,
          })
        }
        props[childrenPropIndex].value.filter((val: string) => val.length !== 0)

        props.push({
          id: generateId(),
          componentId: newId,
          value: croppedValue,
          name: 'children',
          derivedFromComponentType: null,
          derivedFromPropName: null,
        })
      })
    },
    removeSpan(
      state,
      payload: {
        startIndex: number
        endIndex: number
        startNodePosition: number
        endNodePosition: number
      },
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const id = draftState.selectedId

        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )
        const {
          startIndex,
          endIndex,
          startNodePosition,
          endNodePosition,
        } = payload

        let start = startIndex
        let end = endIndex

        //selected the text from right to left
        if (startIndex > endIndex) {
          start = endIndex
          end = startIndex
        }

        const components = isCustomComponentChild
          ? draftState.customComponents
          : draftState.componentsById[componentsId]

        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const childrenPropIndex = props.findIndex(
          prop => prop.name === 'children' && prop.componentId === id,
        )

        props = removeSpanForSelection(
          childrenPropIndex,
          props,
          components,
          id,
          {
            start,
            end,
            startNodePosition,
            endNodePosition,
          },
        )

        props[childrenPropIndex].value = _.flatten(
          props[childrenPropIndex].value,
        )

        const propValue = joinAdjacentTextNodes(
          childrenPropIndex,
          components,
          props,
        )
        props[childrenPropIndex].value = propValue

        if (isCustomComponentChild) draftState.customComponentsProps = props
        else draftState.propsById[propsId] = props
      })
    },
    clearAllFormatting(state): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const componentsId =
          draftState.pages[draftState.selectedPage].componentsId
        const propsId = draftState.pages[draftState.selectedPage].propsId
        const id = draftState.selectedId

        const isCustomComponentChild = checkIsChildOfCustomComponent(
          id,
          draftState.customComponents,
        )

        const components = isCustomComponentChild
          ? draftState.customComponents
          : draftState.componentsById[componentsId]

        let props = isCustomComponentChild
          ? [...draftState.customComponentsProps]
          : [...draftState.propsById[propsId]]

        const childrenPropIndex = props.findIndex(
          prop => prop.name === 'children' && prop.componentId === id,
        )
        const childrenProp = props[childrenPropIndex]
        let newValue = ''

        if (Array.isArray(childrenProp.value)) {
          childrenProp.value.forEach((val: string) => {
            if (components[val]) {
              const spanChildrenValue =
                props.find(
                  prop => prop.componentId === val && prop.name === 'children',
                )?.value || ''
              newValue = newValue + spanChildrenValue
              delete components[val]
              props = props.filter(prop => prop.componentId !== val)
            } else {
              newValue = newValue + val
            }
          })
        }
        props[childrenPropIndex].value = [newValue]

        if (isCustomComponentChild)
          draftState.customComponentsProps = [...props]
        else draftState.propsById[propsId] = [...props]
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
