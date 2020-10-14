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

  //If the prop is already found, update the prop value or else add the prop.
  const existingPropIndex = props.findIndex(
    prop => prop.componentId === id && prop.name === name,
  )

  // If the value is number, convert it to number.

  if (existingPropIndex !== -1) {
    props[existingPropIndex].value = isNaN(value) ? value : parseInt(value, 10)
  } else
    props.push({
      id: generateId(),
      name: name,
      value: isNaN(value) ? value : parseInt(value, 10),
      componentId: id,
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
  const index = props.findIndex(
    prop => prop.componentId === id && prop.name === name,
  )
  props.splice(index, 1)
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
        draftState.customComponentsProps = [...props]
      } else {
        const { props, components } = deleteCustomPropUtility(
          component,
          propName,
          draftState.componentsById[componentsId],
          draftState.propsById[propsId],
        )
        draftState.componentsById[componentsId] = { ...components }
        draftState.propsById[propsId] = [...props]
      }
    },
  )

  //un-expose the props whose value is derived from the prop that is deleted.
  //In order to find the index, we can not use the filter method here.
  draftState.customComponentsProps.forEach((prop, index) => {
    if (
      prop.derivedFromComponentType === componentType &&
      prop.derivedFromPropName === propName
    ) {
      //Remove the prop if its value is empty
      if (prop.value.length === 0) {
        draftState.customComponentsProps.splice(index, 1)
      } else {
        draftState.customComponentsProps[index].derivedFromPropName = null
        draftState.customComponentsProps[index].derivedFromComponentType = null
      }
    }
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

  const childrenPropIndex = props.findIndex(
    prop => prop.componentId === id && prop.name === 'children',
  )
  const childrenProp = props[childrenPropIndex]

  const nodeValue = Array.isArray(value)
    ? value.map((val: any) => val.value)
    : value

  const oldPropValue = Array.isArray(childrenProp.value)
    ? childrenProp.value.map((val: string) => {
        if (isKeyForComponent(val, components)) {
          const spanChildrenProp = props.find(
            prop => prop.name === 'children' && prop.componentId === val,
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

          const spanChildrenPropIndex = props.findIndex(
            prop =>
              prop.componentId === val.componentId && prop.name === 'children',
          )
          props[spanChildrenPropIndex].value = val.value
          propArray.push(val.componentId)
          children.push(val.componentId)
        } else {
          if (index > 0 && value[index - 1].type !== 'SPAN')
            propArray[index - 1] = propArray[index - 1] + val.value
          else propArray.push(val.value)
        }
      },
    )
    props[childrenPropIndex].value = propArray
    components[id].children = children
  } else {
    props[childrenPropIndex].value = value
  }

  let filteredProps: IProp[] = props

  //Remove the un-necessary components.
  spanComponentsToBeDeleted.forEach((val: string) => {
    filteredProps = props.filter(prop => prop.componentId !== val)
    delete components[val]
  })

  if (isCustomComponentChild) draftState.customComponentsProps = filteredProps
  else draftState.propsById[propsId] = filteredProps
}
