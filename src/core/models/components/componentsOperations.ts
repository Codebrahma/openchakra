import { DEFAULT_ID } from './components-types'
import { generatePropId } from '../../../utils/generateId'
import { DEFAULT_PROPS } from '../../../utils/defaultProps'
import {
  loadRequired,
  joinAdjacentTextValues,
  mergeProps,
} from '../../../utils/reducerUtilities'
import {
  deleteCustomPropInRootComponent,
  deleteComp,
  duplicateComp,
} from '../../../utils/recursive'
import { ComponentsState } from './components'

/**
 * @typedef {Object} AddComponentPayload
 * @property {string} componentId - Id of the component
 * @property {string} parentId - Id of the parent component where the component is added.
 * @property {ComponentType} type - Type of the added component.
 */

/**
 * @method
 * @name addComponent
 * @description This function will add the component and its respective props.
 * @param {ComponentsState} draftState workspace state
 * @param {AddComponentPayload} payload
 */
export const addComponent = (
  draftState: ComponentsState,
  payload: { componentId: string; parentId: string; type: ComponentType },
) => {
  const { componentId: id, parentId, type } = payload
  const { components, props } = loadRequired(draftState, parentId)
  const defaultProps: IPropsById = {}
  const defaultPropsIds: string[] = []

  //Add the default props for the component.
  DEFAULT_PROPS[type] &&
    Object.keys(DEFAULT_PROPS[type]).forEach((propName: string) => {
      const propId = generatePropId()
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

/**
 * @typedef {Object} AddMetaComponentPayload
 * @property {IComponents} components - Id of the parent component where the component is added.
 * @property {string} root - Root Parent component id of the meta components.
 * @property {string} parentId - Id of the parent component where the meta component is added.
 */

/**
 * @method
 * @name addMetaComponent
 * @description This function will add the meta components and its respective props.
 * @param {ComponentsState} draftState workspace state
 * @param {AddMetaComponentPayload} payload
 */

export const addMetaComponent = (
  draftState: ComponentsState,
  payload: { components: IComponents; root: string; parentId: string },
) => {
  const { components: metaComponents, root, parentId } = payload
  const { isCustomComponentChild, componentsId, props } = loadRequired(
    draftState,
    parentId,
  )

  //Add the default props for the meta components
  Object.values(metaComponents).forEach(component => {
    props.byComponentId[component.id] = []
    DEFAULT_PROPS[component.type as ComponentType] &&
      Object.keys(DEFAULT_PROPS[component.type as ComponentType]).forEach(
        (propName: string) => {
          const propId = generatePropId()
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
    draftState.customComponents[root].parent = parentId
    draftState.customComponents[parentId].children.push(root)
  } else {
    draftState.componentsById[componentsId] = {
      ...draftState.componentsById[componentsId],
      ...metaComponents,
    }
    draftState.componentsById[componentsId][root].parent = parentId
    draftState.componentsById[componentsId][parentId].children.push(root)
  }
}

/**
 * @typedef {Object} deleteComponentPayload
 * @property {string} componentId - Id of the component to be deleted.
 * @property {string} parentId - Parent id of the component to be deleted.
 */

/**
 * @method
 * @name deleteComponent
 * @description This function will delete the component along with its children and also its respective props.
 * @param {ComponentsState} draftState workspace state
 * @param {deleteComponentPayload} payload
 */
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

  // Deletes the components and its children components along with its respective props
  const { updatedComponents, updatedProps, deletedProps } = deleteComp(
    components[componentId],
    components,
    props,
  )

  // Update the children of the deleted component's parent
  updatedComponents[parentId].children = updatedComponents[
    parentId
  ].children.filter(child => child !== componentId)

  const childrenPropId = updatedProps.byComponentId[parentId]?.find(
    propId => updatedProps.byId[propId].name === 'children',
  )

  // If the deleted component is span
  if (updatedComponents[parentId].type === 'Text' && childrenPropId) {
    updatedProps.byId[childrenPropId].value = updatedProps.byId[
      childrenPropId
    ].value.filter((val: string) => val !== componentId)

    const propValue = joinAdjacentTextValues(
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
  }
}

/**
 * @method
 * @name duplicateComponent
 * @description This function will duplicate the component.
 * @param {ComponentsState} draftState workspace state
 * @param {deleteComponentPayload} selectedComponent component to duplicate
 */
export const duplicateComponent = (
  draftState: ComponentsState,
  selectedComponent: IComponent,
  componentIds: string[],
) => {
  const {
    isCustomComponentChild,
    componentsId,
    components,
    props,
  } = loadRequired(draftState)

  // This function will duplicate the component and also its children
  // And gives a copy of components and respective props
  const { newId, clonedComponents, clonedProps } = duplicateComp(
    selectedComponent,
    components,
    props,
    componentIds,
  )

  // Add the duplicated component id in the children of the parent component
  components[selectedComponent.parent].children.push(newId)

  // If the duplicated component is span
  if (components[selectedComponent.parent].type === 'Text') {
    const parentComponentProps = props.byComponentId[selectedComponent.parent]

    const childrenPropId =
      parentComponentProps.find(id => props.byId[id].name === 'children') || ''
    props.byId[childrenPropId].value.push(newId)
  }

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...components,
      ...clonedComponents,
    }
    mergeProps(props, clonedProps)
  } else {
    draftState.componentsById[componentsId] = {
      ...components,
      ...clonedComponents,
    }
    mergeProps(props, clonedProps)
  }
}
