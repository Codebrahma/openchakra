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
      draftState.customComponentsProps.byComponentId[
        rootCustomParent
      ].findIndex(
        propId => draftState.customComponentsProps.byId[propId].name === name,
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
    const propId = draftState.customComponentsProps.byComponentId[
      componentId
    ].find(
      propId =>
        draftState.customComponentsProps.byId[propId].name === targetedProp,
    )

    if (propId) {
      propValue = draftState.customComponentsProps.byId[propId].value

      draftState.customComponentsProps.byId[propId].derivedFromComponentType =
        draftState.customComponents[rootCustomParent].type

      draftState.customComponentsProps.byId[propId].derivedFromPropName = name
    } else {
      //Add the exposed prop in the custom props
      const newPropId = generateId()
      draftState.customComponentsProps.byComponentId[componentId].push(
        newPropId,
      )
      draftState.customComponentsProps.byId[newPropId] = {
        id: newPropId,
        name: targetedProp,
        value: propValue,
        derivedFromPropName: name,
        derivedFromComponentType:
          draftState.customComponents[rootCustomParent].type,
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
          })
        },
      )
  } else {
    const propId = draftState.propsById[propsId].byComponentId[
      componentId
    ].findIndex(
      propId =>
        draftState.propsById[propsId].byId[propId].name === targetedProp,
    )

    //expose it when the prop is already added or else add the prop and then expose
    if (propId)
      draftState.propsById[propsId].byId[propId].derivedFromPropName = name
    else {
      const newPropId = generateId()
      draftState.customComponentsProps.byComponentId[componentId].push(
        newPropId,
      )
      draftState.customComponentsProps.byId[newPropId] = {
        id: newPropId,
        name: targetedProp,
        value: '',
        derivedFromPropName: name,
        derivedFromComponentType: null,
      }
    }
  }
}

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

  const exposedProp = {
    ...props.byId[exposedPropId],
  }

  //If the value is empty, delete the prop.
  //else old value before exposing will be retained.
  if (props.byId[exposedPropId].value.length === 0) {
    const propIndex = props.byComponentId[componentId].findIndex(
      propId => propId === exposedPropId,
    )
    props.byComponentId[componentId].splice(propIndex, 1)
    delete props.byId[exposedPropId]
  } else {
    props.byId[exposedPropId].derivedFromPropName = null

    props.byId[exposedPropId].derivedFromComponentType = null
  }

  if (isCustomComponentChild) {
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
      draftState.customComponentsProps,
    )

    draftState.customComponentsProps = { ...updatedCustomComponentProps }
    draftState.propsById = { ...updatedPropsById }
    draftState.componentsById = { ...updatedComponentsById }
    draftState.customComponents = { ...updatedCustomComponents }
  }
}
