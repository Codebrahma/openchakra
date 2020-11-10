import { ComponentsState } from './components'
import {
  loadRequired,
  updateInAllInstances,
  addCustomPropsInAllComponentInstances,
  deleteCustomPropUtility,
  deletePropById,
} from '../../../utils/reducerUtilities'
import { searchRootCustomComponent } from '../../../utils/recursive'
import { generatePropId } from '../../../utils/generateId'

export const exposeProp = (
  draftState: ComponentsState,
  payload: { name: string; targetedProp: string },
) => {
  const {
    selectedId: componentId,
    isCustomComponentChild,
    props,
  } = loadRequired(draftState)
  let { name } = payload
  const { targetedProp } = payload

  const propId = props.byComponentId[componentId].find(
    propId => props.byId[propId].name === targetedProp,
  )

  let propValue = ''

  //expose it when the prop is already added or else add the prop and then expose
  if (propId) {
    props.byId[propId].derivedFromPropName = name
    if (isCustomComponentChild)
      props.byId[propId].derivedFromComponentType = componentId

    propValue = props.byId[propId].value
  } else {
    const newPropId = generatePropId()
    props.byComponentId[componentId].push(newPropId)
    props.byId[newPropId] = {
      id: newPropId,
      name: targetedProp,
      value: '',
      derivedFromPropName: name,
      derivedFromComponentType: isCustomComponentChild ? componentId : null,
    }
  }

  if (isCustomComponentChild) {
    //root parent element of the custom component
    const rootCustomParent = searchRootCustomComponent(
      draftState.customComponents[componentId],
      draftState.customComponents,
    )

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
          })
        },
      )
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
    components,
  } = loadRequired(draftState)
  const propName = targetedProp

  const exposedPropId =
    props.byComponentId[componentId].find(
      propId => props.byId[propId].name === propName,
    ) || ''

  const customPropName = props.byId[exposedPropId].derivedFromPropName

  //If the value is empty, delete the prop.
  //else old value before exposing will be retained.
  if (props.byId[exposedPropId].value.length === 0)
    deletePropById(exposedPropId, componentId, props)
  else {
    props.byId[exposedPropId].derivedFromPropName = null

    props.byId[exposedPropId].derivedFromComponentType = null
  }

  if (isCustomComponentChild && customPropName) {
    const rootCustomParent = searchRootCustomComponent(
      components[componentId],
      components,
    )

    updateInAllInstances(
      draftState.pages,
      draftState.componentsById,
      draftState.customComponents,
      rootCustomParent,
      (
        component: IComponent,
        updateInCustomComponent: Boolean,
        propsId: string,
        componentsId: string,
      ) => {
        if (updateInCustomComponent) {
          const { props, components } = deleteCustomPropUtility(
            component,
            customPropName,
            draftState.customComponents,
            draftState.customComponentsProps,
          )
          draftState.customComponents = { ...components }
          draftState.customComponentsProps = { ...props }
        } else {
          const { props, components } = deleteCustomPropUtility(
            component,
            customPropName,
            draftState.componentsById[componentsId],
            draftState.propsById[propsId],
          )
          draftState.componentsById[componentsId] = { ...components }
          draftState.propsById[propsId] = { ...props }
        }
      },
    )
  }
}
