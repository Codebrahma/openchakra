import { ChildrenPropDetails } from './components-types'
import {
  loadRequired,
  updateInAllInstances,
  deleteCustomPropUtility,
  isKeyForComponent,
} from '../../../utils/reducerUtilities'
import { generateId } from '../../../utils/generateId'
import { ComponentsState } from './components'

export const updateProps = (
  draftState: ComponentsState,
  payload: { id: string; name: string; value: any },
) => {
  const { id, name, value } = payload

  const { props } = loadRequired(draftState)

  const targetedComponentProps = props[id]

  //If the prop is already found, update the prop value or else add the prop.
  const existingPropIndex = targetedComponentProps.findIndex(
    prop => prop.name === name,
  )

  // If the value is number, convert it to number.

  if (existingPropIndex !== -1) {
    targetedComponentProps[existingPropIndex].value =
      value.length > 0 && !isNaN(value) ? parseInt(value, 10) : value
  } else
    targetedComponentProps.push({
      id: generateId(),
      name: name,
      value: value.length > 0 && !isNaN(value) ? parseInt(value, 10) : value,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })
}

export const deleteProps = (
  draftState: ComponentsState,
  payload: { id: string; name: string },
) => {
  const { id, name } = payload
  const { props } = loadRequired(draftState, id)
  const selectedComponentProps = props[id]
  const index = selectedComponentProps.findIndex(prop => prop.name === name)
  selectedComponentProps.splice(index, 1)
}

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

  Object.keys(draftState.customComponentsProps).forEach(componentId => {
    draftState.customComponentsProps[componentId].forEach((prop, index) => {
      if (
        prop.derivedFromComponentType === componentType &&
        prop.derivedFromPropName === propName
      ) {
        //Remove the prop if its value is empty
        if (prop.value.length === 0) {
          draftState.customComponentsProps[componentId].splice(index, 1)
        } else {
          draftState.customComponentsProps[componentId][
            index
          ].derivedFromPropName = null
          draftState.customComponentsProps[componentId][
            index
          ].derivedFromComponentType = null
        }
      }
    })
  })
}

export const updateChildrenPropForText = (
  draftState: ComponentsState,
  payload: {
    id: string
    value: string | ChildrenPropDetails
  },
) => {
  const { props, components, isCustomComponentChild, propsId } = loadRequired(
    draftState,
  )

  const { id, value } = payload

  const selectedComponentProps = props[id]

  const childrenPropIndex = selectedComponentProps.findIndex(
    prop => prop.name === 'children',
  )
  const childrenProp = selectedComponentProps[childrenPropIndex]

  const nodeValue = Array.isArray(value)
    ? value.map((val: any) => val.value)
    : value

  const oldPropValue = Array.isArray(childrenProp.value)
    ? childrenProp.value.map((val: string) => {
        if (isKeyForComponent(val, components)) {
          const spanChildrenProp = props[val].find(
            prop => prop.name === 'children',
          )
          return spanChildrenProp?.value
        } else return val
      })
    : childrenProp.value

  // delete old value and add new value only when there is a change in the value
  if (JSON.stringify(nodeValue) === JSON.stringify(oldPropValue)) return

  const spanComponentsToBeDeleted = Array.isArray(childrenProp.value)
    ? childrenProp.value.filter(val => isKeyForComponent(val, components))
    : []

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

          const spanChildrenPropIndex = props[val.componentId].findIndex(
            prop => prop.name === 'children',
          )
          props[val.componentId][spanChildrenPropIndex].value = val.value
          propArray.push(val.componentId)
          children.push(val.componentId)
        } else {
          if (index > 0 && value[index - 1].type !== 'SPAN')
            propArray[index - 1] = propArray[index - 1] + val.value
          else propArray.push(val.value)
        }
      },
    )
    selectedComponentProps[childrenPropIndex].value = propArray
    components[id].children = children
  } else {
    selectedComponentProps[childrenPropIndex].value = value
  }

  let filteredProps: IPropsByComponentId = props

  //Remove the un-necessary components.
  spanComponentsToBeDeleted.forEach((val: string) => {
    Object.keys(filteredProps).forEach(componentId => {
      if (componentId !== val) delete filteredProps[componentId]
    })
    delete components[val]
  })

  if (isCustomComponentChild) draftState.customComponentsProps = filteredProps
  else draftState.propsById[propsId] = filteredProps
}
