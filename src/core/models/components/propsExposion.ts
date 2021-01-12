import { ComponentsState } from './components'
import {
  loadRequired,
  updateInAllInstances,
  addCustomPropsInAllComponentInstances,
  deletePropById,
} from '../../../utils/reducerUtilities'
import {
  searchRootCustomComponent,
  deleteCustomPropInRootComponent,
} from '../../../utils/recursive'
import { generatePropId } from '../../../utils/generateId'

/**
 * @typedef {Object} exposePropPayload
 * @property {string} name - The custom prop name given to the exposed prop
 * @property {string} targetedProp - The name of the prop that is exposed
 */

/**
 * @method
 * @name exposeProp
 * @description This function is used to expose the prop. The value of the exposed prop will be fetched from the custom prop in the root custom component.
 * @param {ComponentsState} draftState workspace state
 * @param {exposePropPayload} payload
 */
export const exposeProp = (
  draftState: ComponentsState,
  payload: { name: string; targetedProp: string; boxId?: string },
) => {
  const {
    selectedId: componentId,
    isCustomComponentChild,
    props,
  } = loadRequired(draftState)
  let { name } = payload
  const { targetedProp, boxId } = payload

  const propId = props.byComponentId[componentId].find(
    propId => props.byId[propId].name === targetedProp,
  )

  let propValue = ''
  const newPropId = generatePropId()

  //root parent element of the custom component
  const rootCustomParent = isCustomComponentChild
    ? searchRootCustomComponent(
        draftState.customComponents[componentId],
        draftState.customComponents,
      )
    : null

  //expose it when the prop is already added or else add the prop and then expose
  if (propId) {
    props.byId[propId].derivedFromPropName = name
    if (isCustomComponentChild)
      props.byId[propId].derivedFromComponentType = rootCustomParent

    propValue = props.byId[propId].value
  } else {
    props.byComponentId[componentId].push(newPropId)
    props.byId[newPropId] = {
      id: newPropId,
      name: targetedProp,
      value: '',
      derivedFromPropName: name,
      derivedFromComponentType: rootCustomParent,
    }
  }

  if (isCustomComponentChild && rootCustomParent) {
    //Check for existing custom prop in root parent.
    const rootCustomParentPropsId = props.byComponentId[rootCustomParent]

    const isCustomPropPresent =
      rootCustomParentPropsId &&
      rootCustomParentPropsId.findIndex(
        propId => props.byId[propId].name === name,
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
          window.prompt('Enter the new prop name for the exposed prop') || name
      }
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
          addCustomPropsInAllComponentInstances({
            exposedProp: {
              name: targetedProp,
              value: propValue,
              customPropName: name,
            },
            exposedPropComponentType:
              draftState.customComponents[componentId].type,
            component,
            propsId,
            componentsId,
            updateInCustomComponent,
            draftState,
            boxId,
          })
        },
      )
  }
}

/**
 * @method
 * @name unExposeProp
 * @description This function is used to unExpose the selected prop.
 * @param {ComponentsState} draftState workspace state
 * @param {string} targetedProp The name of the prop that is to be unExposed.
 */
export const unExposeProp = (
  draftState: ComponentsState,
  targetedProp: string,
) => {
  const {
    selectedId: componentId,
    isCustomComponentChild,
    props,
  } = loadRequired(draftState)
  const propName = targetedProp

  const exposedPropId =
    props.byComponentId[componentId].find(
      propId => props.byId[propId].name === propName,
    ) || ''

  const exposedProp = { ...props.byId[exposedPropId] }

  //If the value is empty, delete the prop.
  //else old value before exposing will be retained.
  if (props.byId[exposedPropId].value.length === 0)
    deletePropById(exposedPropId, componentId, props)
  else {
    props.byId[exposedPropId].derivedFromPropName = null

    props.byId[exposedPropId].derivedFromComponentType = null
  }

  if (isCustomComponentChild && exposedProp) {
    const {
      updatedCustomComponentProps,
      updatedPropsById,
      updatedCustomComponents,
      updatedComponentsById,
    } = deleteCustomPropInRootComponent(
      exposedProp,
      draftState.pages,
      draftState.componentsById,
      draftState.customComponents,
      draftState.propsById,
      props,
    )

    draftState.customComponentsProps = updatedCustomComponentProps
    draftState.propsById = updatedPropsById
    draftState.componentsById = { ...updatedComponentsById }
    draftState.customComponents = { ...updatedCustomComponents }
  }
}
