import { createModel } from '@rematch/core'
import produce from 'immer'
import { DEFAULT_PROPS } from '../../utils/defaultProps'
import templates, { TemplateType } from '../../templates'
import { generateId } from '../../utils/generateId'
import {
  duplicateComponent,
  deleteComponent,
  searchParent,
  updateCustomComponentProps,
  deleteCustomComponentProps,
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

const isCustomComponent = (
  type: string,
  customComponentsList: Array<string>,
) => {
  if (customComponentsList.indexOf(type) !== -1) return true
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

  return { updatedComponents: destinationComponents, newId: newId }
}

const updateInAllInstances = (
  pages: IPages,
  customComponents: IComponents,
  type: string,
  updateCallback: any,
) => {
  Object.values(pages).forEach(components => {
    Object.values(components)
      .filter(component => component.type === type)
      .forEach(component => {
        updateCallback(component)
      })
  })
  Object.values(customComponents)
    .filter(component => component.type === type)
    .forEach(component => {
      updateCallback(component)
    })
  return { updatedPages: pages, updatedCustomComponents: customComponents }
}

const removeExposedChildrenFromParent = (
  component: IComponent,
  propName: string,
) => {
  const exposedPropsChildren = component.exposedPropsChildren
  if (exposedPropsChildren) {
    exposedPropsChildren[propName].splice(
      exposedPropsChildren[propName].indexOf(component.id),
    )
    // delete the prop only when there is no exposed children for the prop
    if (exposedPropsChildren[propName].length === 0) {
      delete component.props[propName]
      delete exposedPropsChildren[propName]
    }
  }
  return exposedPropsChildren
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
        draftState.selectedId = DEFAULT_ID
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

        let components = draftState.pages[draftState.selectedPage]
        if (
          isChildrenOfCustomComponent(selectedId, draftState.customComponents)
        ) {
          //Here the exposed props are stored in children of custom components
          const propValue =
            draftState.customComponents[selectedId].props[
              payload.targetedProp
            ] || ''
          draftState.customComponents[selectedId].exposedProps = {
            ...draftState.customComponents[selectedId].exposedProps,
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

          const {
            updatedPages,
            updatedCustomComponents,
          } = updateInAllInstances(
            draftState.pages,
            draftState.customComponents,
            rootParent.type,
            (component: IComponent) => {
              component.props = {
                ...component.props,
                [payload.name]: propValue,
              }
              const exposedPropsChildren = component.exposedPropsChildren

              if (exposedPropsChildren)
                exposedPropsChildren[payload.name] = exposedPropsChildren[
                  payload.name
                ]
                  ? [...exposedPropsChildren[payload.name], selectedId]
                  : [selectedId]
            },
          )
          draftState.pages = updatedPages
          draftState.customComponents = updatedCustomComponents
        } else {
          //Here the exposed props are stored in children of root components
          const propValue =
            components[selectedId].props[payload.targetedProp] || ''
          console.log('here2')

          if (
            isCustomComponent(
              draftState.pages[draftState.selectedPage][selectedId].type,
              draftState.customComponentList,
            )
          ) {
            console.log('here')
            updateInAllInstances(
              draftState.pages,
              draftState.customComponents,
              draftState.pages[draftState.selectedPage][selectedId].type,
              (component: IComponent) => {
                component.exposedProps = {
                  ...component.exposedProps,
                  [payload.targetedProp]: {
                    targetedProp: payload.targetedProp,
                    customPropName: payload.name,
                    value: propValue,
                  },
                }
              },
            )
          } else {
            components[selectedId].exposedProps = {
              ...components[selectedId].exposedProps,
              [payload.targetedProp]: {
                targetedProp: payload.targetedProp,
                customPropName: payload.name,
                value: propValue,
              },
            }
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
          const selectedCustomComponent =
            draftState.customComponents[componentId]
          //The outer most children of the custom component can not be deleted.
          //only the nested children can be deleted.
          if (
            isCustomComponent(
              draftState.customComponents[selectedCustomComponent.parent].type,
              draftState.customComponentList,
            )
          )
            return state

          const customComponentParent = searchParent(
            draftState.customComponents[selectedCustomComponent.id],
            draftState.customComponents,
            draftState.customComponentList,
          )
          const {
            updatedExposedPropsChildren,
            updatedProps,
          } = deleteCustomComponentProps(
            draftState.customComponents,
            draftState.customComponents[selectedCustomComponent.id],
            customComponentParent,
          )
          const {
            updatedCustomComponents,
            updatedPages,
          } = updateInAllInstances(
            draftState.pages,
            draftState.customComponents,
            customComponentParent.type,
            (component: IComponent) => {
              component.props = updatedProps
              component.exposedPropsChildren = updatedExposedPropsChildren
            },
          )
          draftState.pages = updatedPages
          draftState.customComponents = updatedCustomComponents

          draftState.customComponents = deleteComp(
            selectedCustomComponent,
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
        //The outer most children of the custom component can not be moved.
        //only the nested children can be moved.

        if (
          draftState.customComponents[selectedComponent.parent] &&
          isCustomComponent(
            draftState.customComponents[selectedComponent.parent].type,
            draftState.customComponentList,
          )
        )
          return state

        //check whether the component is moved from the custom component or not.
        if (
          isChildrenOfCustomComponent(
            previousParentId,
            draftState.customComponents,
          )
        ) {
          if (
            isChildrenOfCustomComponent(
              payload.parentId,
              draftState.customComponents,
            )
          ) {
            //Check whether the component is to be moved is not the same type
            const rootParent = searchParent(
              draftState.customComponents[payload.parentId],
              draftState.customComponents,
              draftState.customComponentList,
            )

            if (
              rootParent.type ===
              draftState.customComponents[payload.componentId].type
            )
              return state
            //Here the component to be moved is removed from its parent
            draftState.customComponents = filterChildren(
              draftState.customComponents,
              previousParentId,
              payload.componentId,
            )
            draftState.customComponents = moveToSameComponentsTree(
              draftState.customComponents,
              payload.componentId,
              payload.parentId,
            )
          } else {
            //Here the component to be moved is removed from its parent
            draftState.customComponents = filterChildren(
              draftState.customComponents,
              previousParentId,
              payload.componentId,
            )
            const { updatedComponents } = moveToDifferentComponentsTree(
              draftState.customComponents,
              components,
              payload.componentId,
              payload.parentId,
            )
            draftState.pages[draftState.selectedPage] = updatedComponents
            //Delete the props in parent that are exposed by the moved component
            const customComponentParent = searchParent(
              draftState.customComponents[payload.componentId],
              draftState.customComponents,
              draftState.customComponentList,
            )
            const {
              updatedExposedPropsChildren,
              updatedProps,
            } = deleteCustomComponentProps(
              draftState.customComponents,
              draftState.customComponents[payload.componentId],
              customComponentParent,
            )
            const {
              updatedCustomComponents,
              updatedPages,
            } = updateInAllInstances(
              draftState.pages,
              draftState.customComponents,
              customComponentParent.type,
              (component: IComponent) => {
                component.props = updatedProps
                component.exposedPropsChildren = updatedExposedPropsChildren
              },
            )
            draftState.pages = updatedPages
            draftState.customComponents = updatedCustomComponents

            draftState.customComponents = deleteComponent(
              draftState.customComponents[payload.componentId],
              draftState.customComponents,
            )
          }
        } else {
          if (
            isChildrenOfCustomComponent(
              payload.parentId,
              draftState.customComponents,
            )
          ) {
            //Check whether the component is to be moved is not the same type
            const rootParent = searchParent(
              draftState.customComponents[payload.parentId],
              draftState.customComponents,
              draftState.customComponentList,
            )

            if (
              rootParent.type ===
              draftState.pages[draftState.selectedPage][payload.componentId]
                .type
            )
              return
            draftState.pages[draftState.selectedPage] = filterChildren(
              components,
              previousParentId,
              payload.componentId,
            )

            const { updatedComponents, newId } = moveToDifferentComponentsTree(
              components,
              draftState.customComponents,
              payload.componentId,
              payload.parentId,
            )
            draftState.customComponents = updatedComponents
            draftState.pages[draftState.selectedPage] = deleteComponent(
              components[payload.componentId],
              components,
            )
            const customComponentParent = searchParent(
              draftState.customComponents[newId],
              draftState.customComponents,
              draftState.customComponentList,
            )
            const {
              updatedExposedPropsChildren,
              updatedProps,
            } = updateCustomComponentProps(
              draftState.customComponents,
              draftState.customComponents[newId],
              customComponentParent,
            )
            const {
              updatedCustomComponents,
              updatedPages,
            } = updateInAllInstances(
              draftState.pages,
              draftState.customComponents,
              customComponentParent.type,
              (component: IComponent) => {
                component.props = updatedProps
                component.exposedPropsChildren = updatedExposedPropsChildren
              },
            )
            draftState.pages = updatedPages
            draftState.customComponents = updatedCustomComponents
          } else {
            draftState.pages[draftState.selectedPage] = filterChildren(
              components,
              previousParentId,
              payload.componentId,
            )
            draftState.pages[
              draftState.selectedPage
            ] = moveToSameComponentsTree(
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
          exposedPropsChildren: customComponent.exposedPropsChildren,
          exposedProps: customComponent.exposedProps,
        }

        //check whether the component is added into any children of custom component
        if (
          isChildrenOfCustomComponent(
            payload.parentId,
            draftState.customComponents,
          )
        ) {
          //Check whether the component is to be added is not the same type
          const rootParent = searchParent(
            draftState.customComponents[payload.parentId],
            draftState.customComponents,
            draftState.customComponentList,
          )
          if (rootParent.type === payload.type) return state
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
        const {
          newId,
          clonedComponents,
          customComponentProps,
        } = duplicateComponent(components[selectedId], components, true)
        draftState.customComponents = {
          ...draftState.customComponents,
          ...clonedComponents,
          [CustomName]: {
            id: CustomName,
            type: CustomName,
            children: [newId],
            parent: '',
            props: customComponentProps,
            exposedPropsChildren: {},
          },
        }
        draftState.customComponentList.push(CustomName)
        draftState.customComponents[newId].parent = CustomName

        //delete the children and replace the type , children and props
        // of the original component instance.
        component.children.forEach(child => {
          draftState.pages[draftState.selectedPage] = deleteComp(
            draftState.pages[draftState.selectedPage][child],
            components,
          )
        })
        draftState.pages[draftState.selectedPage][
          component.id
        ].type = CustomName
        draftState.pages[draftState.selectedPage][component.id].children = []
        draftState.pages[draftState.selectedPage][
          component.id
        ].props = customComponentProps
        draftState.pages[draftState.selectedPage][
          component.id
        ].exposedPropsChildren = {}
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
        const components = draftState.pages[draftState.selectedPage]
        const { newId, clonedComponents } = duplicateComponent(
          components[draftState.selectedId],
          components,
        )
        draftState.pages['custom'] = {
          ...draftState.pages['custom'],
          ...clonedComponents,
        }
        draftState.pages['custom']['root'].children.push(newId)
        draftState.pages['custom'][newId].parent = 'root'
      })
    },
    unexpose(state: ComponentsState, targetedProp: string): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const selectedComponent =
          draftState.pages[draftState.selectedPage][draftState.selectedId] ||
          draftState.customComponents[draftState.selectedId]
        const exposedProps = selectedComponent.exposedProps
        if (exposedProps) {
          const customPropName = exposedProps[targetedProp].customPropName
          if (
            draftState.pages[draftState.selectedPage][selectedComponent.id] &&
            isCustomComponent(
              draftState.pages[draftState.selectedPage][selectedComponent.id]
                .type,
              draftState.customComponentList,
            )
          ) {
            updateInAllInstances(
              draftState.pages,
              draftState.customComponents,
              draftState.pages[draftState.selectedPage][selectedComponent.id]
                .type,
              (component: IComponent) => {
                component.exposedProps &&
                  delete component.exposedProps[targetedProp]
              },
            )
          } else delete exposedProps[targetedProp]
          //remove the props from the parent only when the component is custom component.
          if (draftState.customComponents[draftState.selectedId]) {
            const rootParent = searchParent(
              draftState.customComponents[draftState.selectedId],
              draftState.customComponents,
              draftState.customComponentList,
            )
            const {
              updatedCustomComponents,
              updatedPages,
            } = updateInAllInstances(
              draftState.pages,
              draftState.customComponents,
              rootParent.type,
              (component: IComponent) => {
                component.exposedPropsChildren = removeExposedChildrenFromParent(
                  component,
                  customPropName,
                )
              },
            )
            draftState.customComponents = updatedCustomComponents
            draftState.pages = updatedPages
          }
        }
      })
    },
    deleteCustomComponent(
      state: ComponentsState,
      type: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const selectedCustomComponent = draftState.customComponents[type]
        draftState.customComponents = deleteComp(
          draftState.customComponents[selectedCustomComponent.children[0]],
          draftState.customComponents,
        )
        delete draftState.customComponents[type]
        const index = draftState.customComponentList.indexOf(type)
        draftState.customComponentList.splice(index, 1)
      })
    },
    deleteExposedProp(
      state: ComponentsState,
      propName: string,
    ): ComponentsState {
      return produce(state, (draftState: ComponentsState) => {
        const selectedComponent =
          draftState.pages[draftState.selectedPage][draftState.selectedId] ||
          draftState.customComponents[draftState.selectedId]
        const selectedCustomComponent =
          draftState.customComponents[selectedComponent.type]
        const exposedPropsChildren =
          selectedCustomComponent.exposedPropsChildren
        if (exposedPropsChildren && exposedPropsChildren[propName]) {
          exposedPropsChildren[propName].forEach((exposedChild: string) => {
            const exposedProps =
              draftState.customComponents[exposedChild].exposedProps
            exposedProps &&
              Object.values(exposedProps).forEach(prop => {
                if (prop.customPropName === propName)
                  delete exposedProps[prop.targetedProp]
              })
          })
        }
        const { updatedCustomComponents, updatedPages } = updateInAllInstances(
          draftState.pages,
          draftState.customComponents,
          selectedCustomComponent.type,
          (component: IComponent) => {
            const exposedPropsChildren = component.exposedPropsChildren
            if (exposedPropsChildren) {
              delete exposedPropsChildren[propName]
              delete component.props[propName]
            }
          },
        )
        draftState.customComponents = updatedCustomComponents
        draftState.pages = updatedPages
      })
    },
  },
})

export default components
