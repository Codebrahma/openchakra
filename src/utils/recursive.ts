import omit from 'lodash/omit'
import { generateId } from './generateId'
import { updateInAllInstances } from './reducerUtilities'

export const duplicateComp = (
  componentToClone: IComponent,
  sourceComponents: IComponents,
  props: IPropsByComponentId,
) => {
  let clonedComponents: IComponents = {}
  let clonedProps: IPropsByComponentId = {}

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
    props[component.id].forEach(prop => {
      let propValue = prop.value
      if (sourceComponents[prop.value]) {
        const {
          newId,
          clonedComponents: duplicatedComponents,
          clonedProps: duplicatedProps,
        } = duplicateComp(sourceComponents[prop.value], sourceComponents, props)
        propValue = newId
        clonedComponents = {
          ...clonedComponents,
          ...duplicatedComponents,
        }
        clonedProps = { ...clonedProps, ...duplicatedProps }
      }
      if (clonedProps[newId]) {
        clonedProps[newId].push({
          ...prop,
          id: generateId(),
          componentId: newId,
          value: propValue,
        })
      } else {
        clonedProps[newId] = [
          {
            ...prop,
            id: generateId(),
            componentId: newId,
            value: propValue,
          },
        ]
      }
    })

    //Updating the value of the children prop in text component
    if (component.type === 'Text') {
      const childrenPropIndex = clonedProps[newId].findIndex(
        prop => prop.name === 'children',
      )

      const propValue = [...clonedProps[newId][childrenPropIndex].value]

      let childrenIndex = 0
      propValue.forEach((val: string, index: number) => {
        if (sourceComponents[val]) {
          propValue[index] = children[childrenIndex]
          childrenIndex = childrenIndex + 1
        }
      })
      clonedProps[newId][childrenPropIndex].value = propValue
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
  props: IPropsByComponentId,
) => {
  let updatedComponents = { ...components }
  let updatedProps = { ...props }
  let deletedProps: IPropsByComponentId = {}

  function deleteRecursive(component: IComponent) {
    component.children.forEach(child => deleteRecursive(components[child]))
    delete updatedComponents[component.id]
    if (updatedProps[component.id].length > 0) {
      deletedProps = {
        ...deletedProps,
        [component.id]: [...updatedProps[component.id]],
      }
      updatedProps = omit(updatedProps, component.id)
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
  props: IPropsByComponentId,
) => {
  let rootParentProps: IProp[] = []
  let updatedProps = { ...props }
  const fetchAndUpdateExposedPropsRecursive = (comp: IComponent) => {
    comp.children.forEach(child =>
      fetchAndUpdateExposedPropsRecursive(components[child]),
    )

    props[comp.id]
      .filter(prop => prop.derivedFromPropName !== null)
      .forEach(prop => {
        const index = props[comp.id].findIndex(prop_ => prop_.id === prop.id)
        //Update the component type in the exposed props
        updatedProps[comp.id][index].derivedFromComponentType = rootParentId

        //No duplicate props allowed to store in root parent.
        //If the children prop for the box component is exposed, the value for the custom propName is saved as RootCbComposer to identify it.
        if (
          rootParentProps.findIndex(
            rootProp => rootProp.name === prop.derivedFromPropName,
          ) === -1
        )
          rootParentProps.push({
            id: generateId(),
            name: prop.derivedFromPropName || '',
            value:
              prop.name === 'children' &&
              (comp.type === 'Box' || comp.type === 'Flex')
                ? 'RootCbComposer'
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
export const moveComp = (
  componentId: string,
  sourceComponents: IComponents,
  sourceProps: IPropsByComponentId,
) => {
  let updatedSourceComponents = { ...sourceComponents }
  let movedComponents: IComponents = {}
  let updatedSourceProps = { ...sourceProps }
  let movedProps: IPropsByComponentId = {}

  function moveRecursive(compId: string) {
    //find the children of the component
    //the components whose parent is the component(to move) are the children components

    updatedSourceComponents[compId].children.forEach(child =>
      moveRecursive(child),
    )
    movedProps = {
      ...movedProps,
      [compId]: {
        ...sourceProps[compId],
      },
    }
    updatedSourceProps = omit(updatedSourceProps, compId)
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
  props: IPropsByComponentId,
  components: IComponents,
) => {
  let finalControlProp = { ...selectedProp }
  const findControlRecursive = (controlProp: IProp) => {
    let newControlProp = undefined
    Object.keys(props).forEach(componentId => {
      props[componentId].forEach(prop => {
        if (
          prop.derivedFromPropName === controlProp.name &&
          prop.derivedFromComponentType ===
            components[controlProp.componentId].type
        )
          newControlProp = prop
      })
    })
    if (newControlProp) {
      finalControlProp = newControlProp
      findControlRecursive(newControlProp)
    }
  }
  findControlRecursive(selectedProp)
  return finalControlProp
}

export const deleteCustomPropInRootComponent = (
  prop: IProp,
  pages: IPages,
  componentsById: IComponentsById,
  customComponents: IComponents,
  propsById: IPropsById,
  customComponentsProps: IPropsByComponentId,
) => {
  let updatedPropsById = { ...propsById }
  let updatedCustomComponentProps = { ...customComponentsProps }
  let updatedCustomComponents = { ...customComponents }
  let updatedComponentsById = { ...componentsById }

  const deleteCustomPropRecursive = (prop: IProp) => {
    const customComponentType = prop.derivedFromComponentType
    const derivedFromPropName = prop.derivedFromPropName

    // delete the prop in all the instances of custom components
    // only when there is no other children inside the root custom component uses the custom prop

    let checkExposedPropInstance = false
    Object.keys(updatedCustomComponentProps).forEach(componentId => {
      checkExposedPropInstance =
        updatedCustomComponentProps[componentId].findIndex(
          prop =>
            prop.derivedFromComponentType === customComponentType &&
            prop.derivedFromPropName === derivedFromPropName,
        ) !== -1
    })
    if (!checkExposedPropInstance && customComponentType) {
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
            const index = updatedCustomComponentProps[component.id].findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )
            const customProp = updatedCustomComponentProps[component.id][index]

            // we must not delete the custom prop if it uses the children of the instance of custom component(wrapper component)
            if (customProp.name !== 'children')
              updatedCustomComponentProps[component.id].splice(index, 1)

            //Delete the component if the prop is custom children prop(derived prop of exposed children)
            if (customComponents[customProp.value]) {
              const { updatedComponents, updatedProps } = deleteComp(
                customComponents[customProp.value],
                customComponents,
                updatedCustomComponentProps,
              )
              updatedCustomComponentProps = { ...updatedProps }
              updatedCustomComponents = { ...updatedComponents }
            }
            if (customProp.derivedFromComponentType)
              deleteCustomPropRecursive(customProp)
          } else {
            const index = updatedPropsById[propsId][component.id].findIndex(
              prop =>
                prop.name === derivedFromPropName &&
                prop.componentId === component.id,
            )

            const customProp = updatedPropsById[propsId][component.id][index]

            if (customProp.name !== 'children')
              updatedPropsById[propsId][component.id].splice(index, 1)

            //Delete the component if the prop is custom children prop(derived prop of exposed children)
            if (componentsById[componentsId][customProp.value]) {
              const { updatedComponents, updatedProps } = deleteComp(
                componentsById[componentsId][customProp.value],
                componentsById[componentsId],
                updatedPropsById[propsId],
              )
              updatedPropsById[propsId] = { ...updatedProps }
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
