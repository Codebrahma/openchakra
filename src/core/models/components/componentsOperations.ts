import { DEFAULT_ID } from './components-types'
import { generateId } from '../../../utils/generateId'
import { DEFAULT_PROPS } from '../../../utils/defaultProps'
import {
  loadRequired,
  joinAdjacentTextNodes,
} from '../../../utils/reducerUtilities'
import {
  deleteCustomPropInRootComponent,
  deleteComp,
  duplicateComp,
} from '../../../utils/recursive'
import { ComponentsState } from './components'
// import { deleteProps } from './propsOperations'

export const addComponent = (
  draftState: ComponentsState,
  payload: { parentId: string; type: ComponentType },
) => {
  const id = generateId()
  const { parentId, type } = payload
  const { components, props } = loadRequired(draftState, parentId)
  const defaultProps: IPropsById = {}
  const defaultPropsIds: string[] = []

  //Add the default props for the component.
  DEFAULT_PROPS[type] &&
    Object.keys(DEFAULT_PROPS[type]).forEach((propName: string) => {
      const propId = generateId()
      defaultProps[propId] = {
        id: propId,
        name: propName,
        value: DEFAULT_PROPS[type][propName],
        derivedFromPropName: null,
        derivedFromComponentType: null,
      }
      defaultPropsIds.push(propId)
    })
  components[id] = {
    id,
    type: type,
    parent: parentId,
    children: [],
  }
  props.byComponentId[id] = []
  props.byId = {
    ...props.byId,
    ...defaultProps,
  }
  props.byComponentId[id] = [...props.byComponentId[id], ...defaultPropsIds]

  components[parentId].children.push(id)
}

export const addMetaComponent = (
  draftState: ComponentsState,
  payload: { components: IComponents; root: string; parent: string },
) => {
  const { components: metaComponents, root, parent } = payload
  const { isCustomComponentChild, componentsId, props } = loadRequired(
    draftState,
    parent,
  )

  //Add the default props for the components
  Object.values(metaComponents).forEach(component => {
    props.byComponentId[component.id] = []
    DEFAULT_PROPS[component.type as ComponentType] &&
      Object.keys(DEFAULT_PROPS[component.type as ComponentType]).forEach(
        (propName: string) => {
          const propId = generateId()
          props.byComponentId[component.id].push(propId)
          props.byId[propId] = {
            id: propId,
            name: propName,
            value: DEFAULT_PROPS[component.type as ComponentType][propName],
            derivedFromPropName: null,
            derivedFromComponentType: null,
          }
        },
      )
  })

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...draftState.customComponents,
      ...metaComponents,
    }
    draftState.customComponents[root].parent = parent
    draftState.customComponents[parent].children.push(root)
  } else {
    draftState.componentsById[componentsId] = {
      ...draftState.componentsById[componentsId],
      ...metaComponents,
    }
    draftState.componentsById[componentsId][root].parent = parent
    draftState.componentsById[componentsId][parent].children.push(root)
  }
}

export const deleteComponent = (
  draftState: ComponentsState,
  payload: {
    componentId: string
    parentId: string
  },
) => {
  const {
    isCustomComponentChild,
    componentsId,
    components,
    props,
    propsId,
  } = loadRequired(draftState)
  const { componentId, parentId } = payload

  const { updatedComponents, updatedProps, deletedProps } = deleteComp(
    components[componentId],
    components,
    props,
  )
  updatedComponents[parentId].children = updatedComponents[
    parentId
  ].children.filter(child => child !== componentId)

  const childrenPropId = updatedProps.byComponentId[parentId].find(
    propId => updatedProps.byId[propId].name === 'children',
  )

  if (updatedComponents[parentId].type === 'Text' && childrenPropId) {
    updatedProps.byId[childrenPropId].value = updatedProps.byId[
      childrenPropId
    ].value.filter((val: string) => val !== componentId)

    const propValue = joinAdjacentTextNodes(
      updatedProps.byId[childrenPropId],
      components,
    )
    updatedProps.byId[childrenPropId].value = propValue
  }

  draftState.selectedId = DEFAULT_ID
  if (isCustomComponentChild) {
    draftState.customComponents = updatedComponents
    draftState.customComponentsProps = updatedProps

    //deletion of custom props for the exposed props that are deleted
    Object.keys(deletedProps.byComponentId).forEach(componentId => {
      deletedProps.byComponentId[componentId]
        .filter(propId => deletedProps.byId[propId].derivedFromPropName)
        .forEach(customPropId => {
          const {
            updatedCustomComponentProps,
            updatedPropsById,
            updatedComponentsById,
            updatedCustomComponents,
          } = deleteCustomPropInRootComponent(
            deletedProps.byId[customPropId],
            draftState.pages,
            draftState.componentsById,
            draftState.customComponents,
            draftState.propsById,
            draftState.customComponentsProps,
          )
          draftState.propsById = { ...updatedPropsById }
          draftState.customComponentsProps = { ...updatedCustomComponentProps }
          draftState.componentsById = { ...updatedComponentsById }
          draftState.customComponents = { ...updatedCustomComponents }
        })
    })
  } else {
    draftState.propsById[propsId] = { ...updatedProps }
    draftState.componentsById[componentsId] = { ...updatedComponents }
    Object.keys(deletedProps.byComponentId).forEach(componentId => {
      deletedProps.byComponentId[componentId]
        .filter(propId => {
          const prop = deletedProps.byId[propId]
          return draftState.componentsById[componentsId][prop.value]
            ? true
            : false
        })
        .forEach(propId => {
          const prop = deletedProps.byId[propId]
          const { updatedComponents, updatedProps } = deleteComp(
            draftState.componentsById[componentsId][prop.value],
            draftState.componentsById[componentsId],
            draftState.propsById[propsId],
          )
          draftState.propsById[propsId] = { ...updatedProps }
          draftState.componentsById[componentsId] = { ...updatedComponents }
        })
    })
  }
}

export const duplicateComponent = (
  draftState: ComponentsState,
  selectedComponent: IComponent,
) => {
  const {
    isCustomComponentChild,
    propsId,
    componentsId,
    components,
    props,
  } = loadRequired(draftState)

  const { newId, clonedComponents, clonedProps } = duplicateComp(
    selectedComponent,
    components,
    props,
  )
  const parentComponentProps = props.byComponentId[selectedComponent.parent]

  const childrenPropId = parentComponentProps.find(
    id => props.byId[id].name === 'children',
  )

  components[selectedComponent.parent].children.push(newId)

  if (components[selectedComponent.parent].type === 'Text' && childrenPropId)
    props.byId[childrenPropId].value.push(newId)

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...components,
      ...clonedComponents,
    }
    draftState.customComponentsProps = { ...props, ...clonedProps }
  } else {
    draftState.componentsById[componentsId] = {
      ...components,
      ...clonedComponents,
    }
    draftState.propsById[propsId] = { ...props, ...clonedProps }
  }
}
