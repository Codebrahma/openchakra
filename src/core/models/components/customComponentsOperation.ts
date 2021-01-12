import { ComponentsState } from './components'
import { generateComponentId, generatePropId } from '../../../utils/generateId'
import {
  loadRequired,
  duplicateProps,
  mergeProps,
} from '../../../utils/reducerUtilities'
import {
  moveComp,
  fetchAndUpdateExposedProps,
  deleteComp,
} from '../../../utils/recursive'
import checkIsComponentId from '../../../utils/checkIsComponentId'

/**
 * @method
 * @name addCustomComponent
 * @description This function will add the custom component and its respective props.
 * @param {ComponentsState} draftState workspace state
 * @param {AddComponentPayload} payload
 */

export const addCustomComponent = (
  draftState: ComponentsState,
  payload: {
    componentId: string
    parentId: string
    type: string
    defaultProps: IProp[]
  },
) => {
  const { componentId, type, parentId } = payload
  const { components, props } = loadRequired(draftState, parentId)

  const customComponentProps: IPropsById = {}

  draftState.customComponentsProps.byComponentId[type].forEach(propId => {
    customComponentProps[propId] = {
      ...draftState.customComponentsProps.byId[propId],
    }
  })

  const duplicatedProps = duplicateProps(customComponentProps)

  const heightProp = {
    id: generatePropId(),
    name: 'height',
    value: '100%',
    derivedFromPropName: null,
    derivedFromComponentType: null,
  }

  components[componentId] = {
    id: componentId,
    type: payload.type,
    parent: parentId,
    children: [],
  }
  components[parentId].children.push(componentId)

  props.byComponentId[componentId] = []

  Object.values(duplicatedProps).forEach(prop => {
    //If the children of the container is exposed
    if (checkIsComponentId(prop.value)) {
      const boxId = prop.value
      components[boxId] = {
        id: boxId,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      props.byComponentId[boxId] = []
      props.byId[heightProp.id] = {
        ...heightProp,
      }

      prop.value = boxId
    }
    props.byComponentId[componentId].push(prop.id)
    props.byId[prop.id] = { ...prop }
  })
}

/**
 * @typedef {Object} saveComponentPayload
 * @property {string} name - The name of the custom component.
 * @property {string} componentId - The id of the component to be saved.
 * @property {string} parentId - The parent id of the component to be saved.
 */

/**
 * @method
 * @name saveComponent
 * @description This function is used to save the component as custom component.
 * @param {ComponentsState} draftState workspace state
 * @param {AddComponentPayload} payload
 */
export const saveComponent = (
  draftState: ComponentsState,
  payload: {
    name: string
    componentId: string
    parentId: string
    componentInstanceId: string
  },
) => {
  const { propsId, componentsId } = loadRequired(draftState)
  const { name, componentId, parentId } = payload
  const newId = payload.componentInstanceId

  //move the component & props from the components data to custom components data
  const {
    updatedSourceComponents: updatedComponents,
    updatedSourceProps: updatedProps,
    movedComponents,
    movedProps,
  } = moveComp(
    componentId,
    draftState.componentsById[componentsId],
    draftState.propsById[propsId],
  )

  //delete the moved component from the children
  const index = draftState.componentsById[componentsId][
    parentId
  ].children.findIndex(child => child === componentId)

  draftState.componentsById[componentsId][parentId].children.splice(
    index,
    1,
    newId,
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

  mergeProps(draftState.customComponentsProps, movedProps)

  draftState.propsById[propsId].byComponentId[newId] = []
  draftState.customComponentsProps.byComponentId[name] = []

  //change the parent of the child
  draftState.customComponents[componentId].parent = name

  //find the exposed props and update in the root parent of the custom component .Also update the derivedFromComponentType for the exposed props

  const {
    rootParentProps,
    updatedProps: customProps,
  } = fetchAndUpdateExposedProps(
    name,
    draftState.customComponents[componentId],
    draftState.customComponents,
    draftState.customComponentsProps,
  )
  //make a duplicate props for the instance of the custom component.
  const duplicatedProps = duplicateProps(rootParentProps)

  //Add the box component if any value is the key for the components(custom children prop)
  //If the

  Object.values(rootParentProps).forEach(prop => {
    if (prop.value === 'RootCbComposer') {
      const id = generateComponentId()
      draftState.customComponents[id] = {
        id,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      rootParentProps[prop.id].value = id
    }
    draftState.customComponentsProps.byComponentId[name].push(prop.id)
  })

  Object.values(duplicatedProps).forEach(prop => {
    if (prop.value === 'RootCbComposer') {
      const id = generateComponentId()
      draftState.componentsById[componentsId][id] = {
        id,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      duplicatedProps[prop.id].value = id
    }
    draftState.propsById[propsId].byComponentId[newId].push(prop.id)
  })

  draftState.customComponentsProps = {
    byId: {
      ...customProps.byId,
      ...rootParentProps,
    },
    byComponentId: { ...customProps.byComponentId },
  }

  draftState.propsById[propsId] = {
    byId: {
      ...updatedProps.byId,
      ...duplicatedProps,
    },
    byComponentId: { ...updatedProps.byComponentId },
  }
}

/**
 * @method
 * @name deleteCustomComponent
 * @description This function will delete the custom component.
 * @param {ComponentsState} draftState workspace state
 * @param {string} type Name or Type of the custom component to be deleted.
 */
export const deleteCustomComponent = (
  draftState: ComponentsState,
  type: string,
) => {
  const { updatedComponents, updatedProps, deletedProps } = deleteComp(
    draftState.customComponents[type],
    draftState.customComponents,
    draftState.customComponentsProps,
  )
  draftState.customComponents = { ...updatedComponents }
  draftState.customComponentsProps = { ...updatedProps }

  //Exposed children of the box/flex
  Object.keys(deletedProps.byComponentId).forEach(componentId => {
    deletedProps.byComponentId[componentId]
      .filter(propId => {
        // Check whether the prop value is the key of the component
        const prop = deletedProps.byId[propId]
        if (draftState.customComponents[prop.value]) {
          return true
        }
        return false
      })
      .forEach(propId => {
        const prop = deletedProps.byId[propId]

        const { updatedComponents, updatedProps } = deleteComp(
          draftState.customComponents[prop.value],
          draftState.customComponents,
          draftState.customComponentsProps,
        )
        draftState.customComponentsProps = { ...updatedProps }
        draftState.customComponents = { ...updatedComponents }
      })
  })
}
