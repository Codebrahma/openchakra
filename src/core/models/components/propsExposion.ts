import { ComponentsState } from './components'
import {
  loadRequired,
  updateInAllInstances,
  addCustomPropsInAllComponentInstances,
} from '../../../utils/reducerUtilities'
import {
  searchRootCustomComponent,
  deleteCustomPropInRootComponent,
} from '../../../utils/recursive'
import { generateId } from '../../../utils/generateId'

export const exposeProp = (
  draftState: ComponentsState,
  payload: { name: string; targetedProp: string },
) => {
  const {
    selectedId: componentId,
    propsId,
    isCustomComponentChild,
  } = loadRequired(draftState)
  let { name } = payload
  const { targetedProp } = payload

  if (isCustomComponentChild) {
    //root parent element of the custom component
    const rootCustomParent = searchRootCustomComponent(
      draftState.customComponents[componentId],
      draftState.customComponents,
    )

    //Check for existing custom prop in root parent.
    const isCustomPropPresent =
      draftState.customComponentsProps[rootCustomParent].findIndex(
        prop => prop.name === name,
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

    let propValue = ''

    //expose it when the prop is already added or else add the prop and then expose
    const propIndex = draftState.customComponentsProps[componentId].findIndex(
      prop => prop.name === targetedProp,
    )

    if (propIndex !== -1) {
      propValue = draftState.customComponentsProps[componentId][propIndex].value

      draftState.customComponentsProps[componentId][
        propIndex
      ].derivedFromComponentType =
        draftState.customComponents[rootCustomParent].type

      draftState.customComponentsProps[componentId][
        propIndex
      ].derivedFromPropName = name
    } else {
      //Add the exposed prop in the custom props
      draftState.customComponentsProps[componentId].push({
        id: generateId(),
        name: targetedProp,
        value: propValue,
        derivedFromPropName: name,
        derivedFromComponentType:
          draftState.customComponents[rootCustomParent].type,
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
          })
        },
      )
  } else {
    const propIndex = draftState.propsById[propsId][componentId].findIndex(
      prop => prop.name === targetedProp,
    )

    //expose it when the prop is already added or else add the prop and then expose
    if (propIndex !== -1)
      draftState.propsById[propsId][componentId][
        propIndex
      ].derivedFromPropName = name
    else {
      draftState.propsById[propsId][componentId].push({
        id: generateId(),
        name: targetedProp,
        value: '',
        derivedFromPropName: name,
        derivedFromComponentType: null,
      })
    }
  }
}

export const unExposeProp = (
  draftState: ComponentsState,
  targetedProp: string,
) => {
  const {
    propsId,
    selectedId: componentId,
    isCustomComponentChild,
  } = loadRequired(draftState)
  const propName = targetedProp

  if (isCustomComponentChild) {
    const exposedPropIndex = draftState.customComponentsProps[
      componentId
    ].findIndex(prop => prop.name === propName)

    const customProp = {
      ...draftState.customComponentsProps[componentId][exposedPropIndex],
    }

    //If the value is empty, delete the prop.
    //else old value before exposing will be retained.
    if (
      draftState.customComponentsProps[componentId][exposedPropIndex].value
        .length === 0
    )
      draftState.customComponentsProps[componentId].splice(exposedPropIndex, 1)
    else {
      draftState.customComponentsProps[componentId][
        exposedPropIndex
      ].derivedFromPropName = null
      draftState.customComponentsProps[componentId][
        exposedPropIndex
      ].derivedFromComponentType = null
    }

    const {
      updatedCustomComponentProps,
      updatedPropsById,
      updatedCustomComponents,
      updatedComponentsById,
    } = deleteCustomPropInRootComponent(
      customProp,
      draftState.pages,
      draftState.componentsById,
      draftState.customComponents,
      draftState.propsById,
      draftState.customComponentsProps,
    )

    draftState.customComponentsProps = { ...updatedCustomComponentProps }
    draftState.propsById = { ...updatedPropsById }
    draftState.componentsById = { ...updatedComponentsById }
    draftState.customComponents = { ...updatedCustomComponents }
  } else {
    //update only the derivedFromPropName of the exposed prop if it is not a child of custom component
    const exposedPropIndex = draftState.propsById[propsId][
      componentId
    ].findIndex(prop => prop.name === propName)

    //If the value is empty, delete the prop.
    //else old value before exposing will be retained.
    if (
      draftState.propsById[propsId][componentId][exposedPropIndex].value
        .length === 0
    )
      draftState.propsById[propsId][componentId].splice(exposedPropIndex, 1)
    else
      draftState.propsById[propsId][componentId][
        exposedPropIndex
      ].derivedFromPropName = null
  }
}
