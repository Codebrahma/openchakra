import { ComponentsState } from './components'
import { generateId } from '../../../utils/generateId'
import { loadRequired, duplicateProps } from '../../../utils/reducerUtilities'
import {
  moveComp,
  fetchAndUpdateExposedProps,
  deleteComp,
} from '../../../utils/recursive'

export const addCustomComponent = (
  draftState: ComponentsState,
  payload: { parentId: string; type: string },
) => {
  const id = generateId()
  const { type, parentId } = payload
  const { isCustomComponentChild, propsId, components, props } = loadRequired(
    draftState,
    parentId,
  )

  const customComponentsProps = { ...draftState.customComponentsProps }

  const duplicatedProps = duplicateProps(customComponentsProps[type], id)

  const heightProp = {
    id: generateId(),
    name: 'height',
    value: '100%',
    componentId: '',
    derivedFromPropName: null,
    derivedFromComponentType: null,
  }

  components[id] = {
    id,
    type: payload.type,
    parent: parentId,
    children: [],
  }
  components[parentId].children.push(id)

  duplicatedProps.forEach((prop, index) => {
    //If the children of the container is exposed
    if (draftState.customComponents[prop.value]) {
      const id = generateId()
      components[id] = {
        id,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      props[id].push({
        ...heightProp,
        componentId: id,
      })
      duplicatedProps[index].value = id
    }
  })
  if (isCustomComponentChild)
    draftState.customComponentsProps = { ...props, [id]: [...duplicatedProps] }
  else draftState.propsById[propsId] = { ...props, [id]: [...duplicatedProps] }
}

export const saveComponent = (
  draftState: ComponentsState,
  payload: { name: string; componentId: string; parentId: string },
) => {
  const { propsId, componentsId } = loadRequired(draftState)
  const { name, componentId, parentId } = payload
  const newId = generateId()

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
    { ...draftState.customComponentsProps, ...movedProps },
  )
  //make a duplicate props for the instance of the custom component.
  const duplicatedProps = duplicateProps(rootParentProps, newId)

  //Add the box component if any value is the key for the components(custom children prop)
  //If the

  rootParentProps.forEach((prop, index) => {
    if (prop.value === 'RootCbComposer') {
      const id = generateId()
      draftState.customComponents[id] = {
        id,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      rootParentProps[index].value = id
    }
  })

  duplicatedProps.forEach((prop, index) => {
    if (prop.value === 'RootCbComposer') {
      const id = generateId()
      draftState.componentsById[componentsId][id] = {
        id,
        type: 'Box',
        parent: 'Prop',
        children: [],
      }
      duplicatedProps[index].value = id
    }
  })
  draftState.propsById[propsId] = {
    ...updatedProps,
    [newId]: [...duplicatedProps],
  }
  draftState.customComponentsProps = {
    ...customProps,
    [newId]: [...rootParentProps],
  }
}

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
  Object.keys(deletedProps).forEach(componentId => {
    deletedProps[componentId]
      .filter(prop => draftState.customComponents[prop.value])
      .forEach(prop => {
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
