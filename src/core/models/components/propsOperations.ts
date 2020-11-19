import { ChildrenPropDetails } from './components-types'
import {
  loadRequired,
  updateInAllInstances,
  deleteCustomPropUtility,
  isKeyForComponent,
  deletePropById,
  deletePropsByComponentId,
} from '../../../utils/reducerUtilities'
import { generatePropId } from '../../../utils/generateId'
import { ComponentsState } from './components'
import convertToProperPropName from '../../../utils/convertToProperPropName'

/**
 * @typedef {Object} updatePropsPayload
 * @property {string} componentId - component id where the props should be updated.
 * @property {ComponentType} id - Prop id
 * @property {string} name - Prop name
 * @property {any} value - Prop value
 */

/**
 * @method
 * @name updateProp
 * @description This function will update the props on the selected component.
 * @param {ComponentsState} draftState workspace state
 * @param {updatePropsPayload} payload
 */
export const updateProp = (
  draftState: ComponentsState,
  payload: { componentId: string; id: string; name: string; value: any },
) => {
  const { componentId, id, name, value } = payload
  const { props } = loadRequired(draftState)

  // If the value is number, convert it to number.
  const propValue =
    value.length > 0 && !isNaN(value) ? parseInt(value, 10) : value

  // If the instance of prop-id is already present, just update the value using the prop-id
  // Or else generate new id for the prop.
  if (props.byId[id] !== undefined) {
    // iF the prop-value is empty, remove the prop
    if (propValue.length === 0) deletePropById(id, componentId, props)
    else props.byId[id].value = propValue
  } else {
    const newPropId = generatePropId()
    props.byComponentId[componentId].push(newPropId)
    props.byId[newPropId] = {
      id: newPropId,
      name: name,
      value: propValue,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    }
  }
}

/**
 * @method
 * @name addProps
 * @description This function will add the list of props based on key and value.
 * @param {ComponentsState} draftState workspace state
 * @param {updatePropsPayload} propsObject  This includes the key and value pair of props.
 */

export const addProps = (draftState: ComponentsState, propsObject: any) => {
  const { props, selectedId } = loadRequired(draftState)

  Object.keys(propsObject).forEach(propKey => {
    const value = propsObject[propKey]
    const propName = convertToProperPropName(propKey)

    // If the value is number, convert it to number.
    const propValue =
      value.length > 0 && !isNaN(value) ? parseInt(value, 10) : value

    let existingPropId: undefined | string = undefined

    props.byComponentId[selectedId].forEach(propId => {
      if (props.byId[propId].name === propName)
        existingPropId = props.byId[propId].id
    })
    if (existingPropId) {
      props.byId[existingPropId].value = propValue
    } else {
      const newPropId = generatePropId()
      props.byComponentId[selectedId].push(newPropId)
      props.byId[newPropId] = {
        id: newPropId,
        name: propName,
        value: propValue,
        derivedFromPropName: null,
        derivedFromComponentType: null,
      }
    }
  })
}

/**
 * @typedef {Object} deletePropsPayload
 * @property {string} componentId - component id where the props should be updated.
 * @property {ComponentType} propId - Prop id to be deleted
 */

/**
 * @method
 * @name deleteProps
 * @description This function will delete the selected prop.
 * @param {ComponentsState} draftState workspace state
 * @param {deletePropsPayload} payload
 */

export const deleteProps = (
  draftState: ComponentsState,
  payload: { componentId: string; propId: string },
) => {
  const { componentId, propId } = payload
  const { props } = loadRequired(draftState, componentId)
  deletePropById(propId, componentId, props)
}

/**
 * @method
 * @name deleteCustomProp
 * @description This function will delete the selected custom prop.
 * @param {ComponentsState} draftState workspace state
 * @param {string} propName
 */

export const deleteCustomProp = (
  draftState: ComponentsState,
  propName: string,
) => {
  const { selectedId: componentId, components } = loadRequired(draftState)
  const componentType = components[componentId].type

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
        draftState.customComponentsProps = { ...props }
      } else {
        const { props, components } = deleteCustomPropUtility(
          component,
          propName,
          draftState.componentsById[componentsId],
          draftState.propsById[propsId],
        )
        draftState.componentsById[componentsId] = { ...components }
        draftState.propsById[propsId] = { ...props }
      }
    },
  )

  //un-expose the props whose value is derived from the prop that is deleted.
  //In order to find the index, we can not use the filter method here.

  Object.keys(draftState.customComponentsProps.byComponentId).forEach(
    componentId => {
      draftState.customComponentsProps.byComponentId[componentId].forEach(
        (propId, index) => {
          const prop = draftState.customComponentsProps.byId[propId]
          if (
            prop.derivedFromComponentType === componentType &&
            prop.derivedFromPropName === propName
          ) {
            //Remove the prop if its value is empty
            if (
              draftState.customComponentsProps.byId[propId].value.length === 0
            ) {
              draftState.customComponentsProps.byComponentId[
                componentId
              ].splice(index, 1)
              delete draftState.customComponentsProps.byId[propId]
            } else {
              draftState.customComponentsProps.byId[
                propId
              ].derivedFromPropName = null
              draftState.customComponentsProps.byId[
                propId
              ].derivedFromComponentType = null
            }
          }
        },
      )
    },
  )
}

/**
 * @typedef {Object} updateChildrenPropPayload
 * @property {string} id - component id of the text component
 * @property {string} value - prop value to be updated
 */

/**
 * @method
 * @name updateChildrenPropForText
 * @description This function will update the value of children prop in the text component.
 * @param {ComponentsState} draftState workspace state
 * @param {updateChildrenPropPayload} payload
 */

export const updateChildrenPropForText = (
  draftState: ComponentsState,
  payload: {
    id: string
    value: string | ChildrenPropDetails
  },
) => {
  const { props, components } = loadRequired(draftState)

  const { id, value } = payload

  const childrenPropId =
    props.byComponentId[id].find(
      propId => props.byId[propId].name === 'children',
    ) || ''

  const childrenProp = props.byId[childrenPropId]

  const nodeValue = Array.isArray(value)
    ? value.map((val: any) => val.value)
    : value

  // Get the old value for the children prop
  const oldPropValue = Array.isArray(childrenProp.value)
    ? childrenProp.value.map((val: string) => {
        if (isKeyForComponent(val, components)) {
          const spanChildrenPropId =
            props.byComponentId[val].find(
              propId => props.byId[propId].name === 'children',
            ) || ''
          return props.byId[spanChildrenPropId]?.value
        } else return val
      })
    : childrenProp.value

  // delete old value and add new value only when there is a change in the value
  if (JSON.stringify(nodeValue) === JSON.stringify(oldPropValue)) return

  const spanComponentsToBeDeleted = Array.isArray(childrenProp.value)
    ? childrenProp.value.filter(val => isKeyForComponent(val, components))
    : []

  // If the value is an array, find whether the value in each index is an span element or string value
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

          const spanChildrenPropId =
            props.byComponentId[val.componentId].find(
              propId => props.byId[propId].name === 'children',
            ) || ''

          props.byId[spanChildrenPropId].value = val.value
          propArray.push(val.componentId)
          children.push(val.componentId)
        } else {
          if (index > 0 && value[index - 1].type !== 'SPAN')
            propArray[index - 1] = propArray[index - 1] + val.value
          else propArray.push(val.value)
        }
      },
    )
    props.byId[childrenPropId].value = propArray
    components[id].children = children
  } else {
    props.byId[childrenPropId].value = value
  }

  spanComponentsToBeDeleted.forEach((val: string) => {
    Object.keys(props.byComponentId).forEach(componentId => {
      if (componentId !== val) deletePropsByComponentId(componentId, props)
    })

    delete components[val]
  })
}
