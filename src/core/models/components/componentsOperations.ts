import { DEFAULT_ID } from './components-types'
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

const updatePropsState = (props: IProps, newProps: IProps) => {
  return {
    byId: {
      ...props.byId,
      ...newProps.byId,
    },
    byComponentId: {
      ...props.byComponentId,
      ...newProps.byComponentId,
    },
  }
}

export const addComponent = (
  draftState: ComponentsState,
  payload: {
    components: IComponents
    props: IProps
    rootComponentId: string
    parentId: string
  },
) => {
  const { components, props, rootComponentId, parentId } = payload
  const { isCustomComponentChild } = loadRequired(draftState, parentId)

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...draftState.customComponents,
      ...components,
    }
    draftState.customComponentsProps = updatePropsState(
      draftState.customComponentsProps,
      props,
    )
    draftState.customComponents[parentId].children.push(rootComponentId)
  } else {
    draftState.components = {
      ...draftState.components,
      ...components,
    }
    draftState.props = updatePropsState(draftState.props, props)
    draftState.components[parentId].children.push(rootComponentId)
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
  const { isCustomComponentChild, components, props } = loadRequired(draftState)
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
            updatedProps,
            updatedComponents,
            updatedCustomComponents,
          } = deleteCustomPropInRootComponent(
            deletedProps.byId[customPropId],
            draftState.components,
            draftState.customComponents,
            draftState.props,
            draftState.customComponentsProps,
          )
          draftState.props = { ...updatedProps }
          draftState.customComponentsProps = { ...updatedCustomComponentProps }
          draftState.components = { ...updatedComponents }
          draftState.customComponents = { ...updatedCustomComponents }
        })
    })
  } else {
    draftState.props = { ...updatedProps }
    draftState.components = { ...updatedComponents }
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
  const { isCustomComponentChild, components, props } = loadRequired(draftState)

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
    draftState.components = {
      ...components,
      ...clonedComponents,
    }
    mergeProps(props, clonedProps)
  }
}
