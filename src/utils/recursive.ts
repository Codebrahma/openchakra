// import omit from 'lodash/omit'
import { generateId } from './generateId'
import { updateInAllInstances } from '../core/models/components'

export const duplicateComponent = (
  componentToClone: IComponent,
  sourceComponents: IComponents,
  props: IProp[],
) => {
  let clonedComponents: IComponents = {}
  let clonedProps: IProp[] = []

  const cloneComponent = (component: IComponent) => {
    const newId = generateId()
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
        let propValue = prop.value
        if (sourceComponents[prop.value]) {
          const {
            newId,
            clonedComponents: duplicatedComponents,
            clonedProps: duplicatedProps,
          } = duplicateComponent(
            sourceComponents[prop.value],
            sourceComponents,
            props,
          )
          propValue = newId
          clonedComponents = {
            ...clonedComponents,
            ...duplicatedComponents,
          }
          clonedProps = [...clonedProps, ...duplicatedProps]
        }
        clonedProps.push({
          ...prop,
          id: generateId(),
          componentId: newId,
          value: propValue,
        })
      })

    //Updating the value of the children prop in text component
    if (component.type === 'Text') {
      const childrenPropIndex = clonedProps.findIndex(
        prop => prop.componentId === newId && prop.name === 'children',
      )

      const propValue = [...clonedProps[childrenPropIndex].value]

      let childrenIndex = 0
      propValue.forEach((val: string, index: number) => {
        if (sourceComponents[val]) {
          propValue[index] = children[childrenIndex]
          childrenIndex = childrenIndex + 1
        }
      })
      clonedProps[childrenPropIndex].value = propValue
    }

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

//This function will update the derivedFromComponentType of the props that are exposed.
//And also returns its custom propName along with its value.
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
        //If the children prop for the box component is exposed, the value for the custom propName is saved as Root to identify it.
        if (
          rootParentProps.findIndex(
            rootProp => rootProp.name === prop.derivedFromPropName,
          ) === -1
        )
          rootParentProps.push({
            id: generateId(),
            name: prop.derivedFromPropName || '',
            value:
              prop.name === 'children' && component.type === 'Box'
                ? 'Root'
                : prop.value,
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

//Searches the root parent of the custom component
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

//Finds the control for the custom props.
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

export const deleteCustomProp = (
  prop: IProp,
  pages: IPages,
  componentsById: IComponentsById,
  customComponents: IComponents,
  propsById: IPropsById,
  customComponentsProps: IProp[],
) => {
  let updatedPropsById = { ...propsById }
  let updatedCustomComponentProps = [...customComponentsProps]
  let updatedCustomComponents = { ...customComponents }
  let updatedComponentsById = { ...componentsById }

  const deleteCustomPropRecursive = (prop: IProp) => {
    const customComponentType = prop.derivedFromComponentType
    const derivedFromPropName = prop.derivedFromPropName

    // delete the prop in all the instances of custom components
    // only when there is no other children inside the root custom component uses the custom prop

    const checkExposedPropInstance = updatedCustomComponentProps.findIndex(
      prop =>
        prop.derivedFromComponentType === customComponentType &&
        prop.derivedFromPropName === derivedFromPropName,
    )
    if (checkExposedPropInstance === -1 && customComponentType) {
      updateInAllInstances(
        pages,
        componentsById,
        customComponents,
        customComponentType,
        (
          component: IComponent,
          updateInCustomComponent: Boolean,
          propsId: string,
          componentsId: string,
        ) => {
          if (updateInCustomComponent) {
            const index = updatedCustomComponentProps.findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )
            const customProp = updatedCustomComponentProps[index]

            if (customProp.name !== 'children')
              updatedCustomComponentProps.splice(index, 1)

            //Delete the component if the prop is custom children prop(derived prop of exposed children)
            if (customComponents[customProp.value]) {
              const { updatedComponents, updatedProps } = deleteComp(
                customComponents[customProp.value],
                customComponents,
                updatedCustomComponentProps,
              )
              updatedCustomComponentProps = [...updatedProps]
              updatedCustomComponents = { ...updatedComponents }
            }
            if (customProp.derivedFromComponentType)
              deleteCustomPropRecursive(customProp)
          } else {
            const index = updatedPropsById[propsId].findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )

            const customProp = updatedPropsById[propsId][index]

            if (customProp.name !== 'children')
              updatedPropsById[propsId].splice(index, 1)

            //Delete the component if the prop is custom children prop(derived prop of exposed children)
            if (componentsById[componentsId][customProp.value]) {
              const { updatedComponents, updatedProps } = deleteComp(
                componentsById[componentsId][customProp.value],
                componentsById[componentsId],
                updatedPropsById[propsId],
              )
              updatedPropsById[propsId] = [...updatedProps]
              updatedComponentsById[componentsId] = { ...updatedComponents }
            }
          }
        },
      )
    }
  }
  deleteCustomPropRecursive(prop)
  return {
    updatedPropsById,
    updatedCustomComponentProps,
    updatedCustomComponents,
    updatedComponentsById,
  }
}
