// import omit from 'lodash/omit'
import { generateId } from './generateId'
import { updateInAllInstances } from '../core/models/components'

export const duplicateComponent = (
  componentToClone: IComponent,
  sourceComponents: IComponents,
  props: IProp[],
) => {
  const clonedComponents: IComponents = {}
  const clonedProps: IProp[] = []

  const cloneComponent = (component: IComponent) => {
    const newId = generateId()
    const newPropId = generateId()
    const children = component.children.map(child => {
      return cloneComponent(sourceComponents[child])
    })

    clonedComponents[newId] = {
      ...component,
      id: newId,
      children,
    }
    props
      .filter(prop => prop.componentId === component.id)
      .forEach(prop => {
        clonedProps.push({
          ...prop,
          id: newPropId,
          componentId: newId,
        })
      })

    children.forEach(child => {
      clonedComponents[child].parent = newId
    })

    return newId
  }

  const newId = cloneComponent(componentToClone)

  return {
    newId,
    clonedComponents,
    clonedProps,
  }
}

export const deleteComp = (
  component: IComponent,
  components: IComponents,
  props: IProp[],
) => {
  let updatedComponents = { ...components }
  let updatedProps = [...props]
  let deletedProps: IProp[] = []

  function deleteRecursive(component: IComponent) {
    //find the children of the component
    //the components whose parent is the component(to delete) are the children components

    component.children.forEach(child => deleteRecursive(components[child]))
    delete updatedComponents[component.id]
    if (updatedProps.length > 0) {
      deletedProps = [
        ...deletedProps,
        ...updatedProps.filter(prop => prop.componentId === component.id),
      ]
      updatedProps = updatedProps.filter(
        prop => prop.componentId !== component.id,
      )
    }
  }

  deleteRecursive(component)

  return { updatedComponents, updatedProps, deletedProps }
}

export const fetchAndUpdateExposedProps = (
  rootParentId: string,
  component: IComponent,
  components: IComponents,
  props: IProp[],
) => {
  let rootParentProps: IProp[] = []
  let updatedProps = [...props]
  const fetchAndUpdateExposedPropsRecursive = (comp: IComponent) => {
    comp.children.forEach(child =>
      fetchAndUpdateExposedPropsRecursive(components[child]),
    )

    props
      .filter(prop => prop.componentId === comp.id)
      .filter(prop => prop.derivedFromPropName !== null)
      .forEach(prop => {
        const index = props.findIndex(prop_ => prop_.id === prop.id)
        //Update the component type in the exposed props
        updatedProps[index].derivedFromComponentType = rootParentId

        //No duplicate props allowed to store in root parent.
        if (
          rootParentProps.findIndex(
            rootProp => rootProp.name === prop.derivedFromPropName,
          ) === -1
        )
          rootParentProps.push({
            id: generateId(),
            name: prop.derivedFromPropName || '',
            value: prop.value,
            componentId: rootParentId,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          })
      })
  }
  fetchAndUpdateExposedPropsRecursive(component)
  return { rootParentProps, updatedProps }
}

//moves both the components and also the props
export const moveComponent = (
  componentId: string,
  sourceComponents: IComponents,
  sourceProps: IProp[],
) => {
  let updatedSourceComponents = { ...sourceComponents }
  let movedComponents: IComponents = {}
  let updatedSourceProps = [...sourceProps]
  let movedProps: IProp[] = []

  function moveRecursive(compId: string) {
    //find the children of the component
    //the components whose parent is the component(to move) are the children components

    updatedSourceComponents[compId].children.forEach(child =>
      moveRecursive(child),
    )
    movedProps = [
      ...movedProps,
      ...sourceProps.filter(prop => prop.componentId === compId),
    ]
    updatedSourceProps = updatedSourceProps.filter(
      prop => prop.componentId !== compId,
    )
    movedComponents = {
      ...movedComponents,
      [compId]: {
        ...updatedSourceComponents[compId],
      },
    }
    delete updatedSourceComponents[compId]
  }

  moveRecursive(componentId)
  return {
    updatedSourceComponents,
    movedComponents,
    updatedSourceProps,
    movedProps,
  }
}

export const searchRootCustomComponent = (
  component: IComponent,
  customComponents: IComponents,
) => {
  let rootId = ''

  const searchRootRecursive = (comp: IComponent) => {
    if (comp.parent.length === 0) rootId = comp.id
    else searchRootRecursive(customComponents[comp.parent])
  }

  searchRootRecursive(component)
  return rootId
}

export const findControl = (
  selectedProp: IProp,
  props: IProp[],
  components: IComponents,
) => {
  let finalControlProp = { ...selectedProp }
  const findControlRecursive = (controlProp: IProp) => {
    const newControlProp = props.find(
      prop =>
        prop.derivedFromPropName === controlProp.name &&
        prop.derivedFromComponentType ===
          components[controlProp.componentId].type,
    )
    if (newControlProp) {
      finalControlProp = newControlProp
      findControlRecursive(newControlProp)
    }
  }
  findControlRecursive(selectedProp)
  return finalControlProp
}

export const unExposeProp = (
  exposedProp: IProp,
  components: IComponents,
  customComponents: IComponents,
  props: IProp[],
  customComponentsProps: IProp[],
) => {
  // delete the prop in all the instances of custom components
  // only when there is no other children inside the root custom component uses the custom prop

  const updatedProps = [...props]
  const updatedCustomComponentProps = [...customComponentsProps]

  const unExposePropRecursive = (exposedProp: IProp) => {
    const customComponentType = exposedProp.derivedFromComponentType
    const derivedFromPropName = exposedProp.derivedFromPropName
    const checkExposedPropInstance = updatedCustomComponentProps.findIndex(
      prop =>
        prop.derivedFromComponentType === customComponentType &&
        prop.derivedFromPropName === derivedFromPropName,
    )
    if (checkExposedPropInstance === -1 && customComponentType) {
      updateInAllInstances(
        components,
        customComponents,
        customComponentType,
        (component: IComponent, updateInCustomComponent: Boolean) => {
          if (updateInCustomComponent) {
            const index = updatedCustomComponentProps.findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )
            const exposedProp = updatedCustomComponentProps[index]
            updatedCustomComponentProps.splice(index, 1)
            if (exposedProp.derivedFromComponentType)
              unExposePropRecursive(exposedProp)
          } else {
            const index = props.findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )
            updatedProps.splice(index, 1)
          }
        },
      )
    }
  }
  unExposePropRecursive(exposedProp)
  return {
    updatedProps,
    updatedCustomComponentProps,
  }
}
