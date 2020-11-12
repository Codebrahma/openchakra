import { generatePropId, generateComponentId } from './generateId'
import {
  updateInAllInstances,
  deletePropsByComponentId,
  deletePropById,
  mergeProps,
} from './reducerUtilities'

export const duplicateComp = (
  componentToClone: IComponent,
  sourceComponents: IComponents,
  props: IProps,
) => {
  let clonedComponents: IComponents = {}
  let clonedProps: IProps = {
    byId: {},
    byComponentId: {},
  }

  const cloneComponent = (component: IComponent) => {
    const newId = generateComponentId()
    const children = component.children.map(child => {
      return cloneComponent(sourceComponents[child])
    })

    clonedComponents[newId] = {
      ...component,
      id: newId,
      children,
    }
    props.byComponentId[component.id]?.forEach(propId => {
      const prop = props.byId[propId]
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

        mergeProps(clonedProps, duplicatedProps)
      }
      const newPropId = generateComponentId()

      if (clonedProps.byComponentId[newId]) {
        clonedProps.byComponentId[newId].push(newPropId)
      } else {
        clonedProps.byComponentId[newId] = [newPropId]
      }
      clonedProps.byId[newPropId] = {
        ...prop,
        id: newPropId,
        value: propValue,
      }
    })

    //Updating the value of the children prop in text component
    if (component.type === 'Text') {
      const childrenPropId = clonedProps.byComponentId[newId].find(
        propId => clonedProps.byId[propId].value === 'children',
      )

      if (childrenPropId) {
        const propValue = [...clonedProps.byId[childrenPropId].value]

        let childrenIndex = 0
        propValue.forEach((val: string, index: number) => {
          if (sourceComponents[val]) {
            propValue[index] = children[childrenIndex]
            childrenIndex = childrenIndex + 1
          }
        })
        clonedProps.byId[childrenPropId].value = propValue
      }
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
  props: IProps,
) => {
  const updatedComponents = { ...components }
  const updatedProps = { ...props }
  const deletedProps: IProps = {
    byId: {},
    byComponentId: {},
  }

  function deleteRecursive(component: IComponent) {
    component.children.forEach(child => deleteRecursive(components[child]))
    delete updatedComponents[component.id]
    if (updatedProps.byComponentId[component.id]?.length > 0) {
      // store the props that are deleted
      deletedProps.byComponentId[component.id] = [
        ...updatedProps.byComponentId[component.id],
      ]
      updatedProps.byComponentId[component.id]?.forEach(propId => {
        deletedProps.byId[propId] = {
          ...updatedProps.byId[propId],
        }
      })

      // After storing the deleted props, delete the props of that component
      deletePropsByComponentId(component.id, updatedProps)
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
  props: IProps,
) => {
  let rootParentProps: IPropsById = {}
  let updatedProps = { ...props }
  const fetchAndUpdateExposedPropsRecursive = (comp: IComponent) => {
    comp.children.forEach(child =>
      fetchAndUpdateExposedPropsRecursive(components[child]),
    )

    props.byComponentId[comp.id]
      .filter(propId => props.byId[propId].derivedFromPropName !== null)
      .forEach(propId => {
        const prop = updatedProps.byId[propId]
        //Update the component type in the exposed props
        updatedProps.byId[propId].derivedFromComponentType = rootParentId

        //No duplicate props allowed to store in root parent.
        //If the children prop for the box component is exposed, the value for the custom propName is saved as RootCbComposer to identify it.
        if (
          Object.values(rootParentProps).findIndex(
            rootProp => rootProp.name === prop.derivedFromPropName,
          ) === -1
        ) {
          const newPropId = generatePropId()
          rootParentProps[newPropId] = {
            id: newPropId,
            name: prop.derivedFromPropName || '',
            value:
              prop.name === 'children' &&
              (comp.type === 'Box' || comp.type === 'Flex')
                ? 'RootCbComposer'
                : prop.value,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          }
        }
      })
  }
  fetchAndUpdateExposedPropsRecursive(component)
  return { rootParentProps, updatedProps }
}

//moves both the components and also the props
export const moveComp = (
  componentId: string,
  sourceComponents: IComponents,
  sourceProps: IProps,
) => {
  const updatedSourceComponents = { ...sourceComponents }
  let movedComponents: IComponents = {}
  const updatedSourceProps = { ...sourceProps }
  const movedProps: IProps = {
    byComponentId: {},
    byId: {},
  }

  function moveRecursive(compId: string) {
    //find the children of the component
    //the components whose parent is the component(to move) are the children components
    updatedSourceComponents[compId].children.forEach(child =>
      moveRecursive(child),
    )

    // The moved props should be stored in separate variable
    movedProps.byComponentId[compId] = [...sourceProps.byComponentId[compId]]
    sourceProps.byComponentId[compId].forEach(propId => {
      movedProps.byId[propId] = { ...sourceProps.byId[propId] }
    })

    // After moving the props, delete the props of the component
    deletePropsByComponentId(compId, sourceProps)

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
  componentId: string,
  selectedProp: IProp,
  props: IProps,
  components: IComponents,
) => {
  let finalControlProp = { ...selectedProp }
  let finalControlPropComponentId = componentId
  const findControlRecursive = (
    controlProp: IProp,
    controlPropComponentId: string,
  ) => {
    let newControlProp = undefined
    let newControlPropComponentId = undefined

    Object.keys(props.byComponentId).forEach(componentId => {
      props.byComponentId[componentId].forEach(propId => {
        const prop = props.byId[propId]
        if (
          prop.derivedFromPropName === controlProp.name &&
          prop.derivedFromComponentType ===
            components[controlPropComponentId].type
        ) {
          newControlProp = prop
          newControlPropComponentId = componentId
        }
      })
    })
    if (newControlProp && newControlPropComponentId) {
      finalControlProp = newControlProp
      finalControlPropComponentId = newControlPropComponentId
      findControlRecursive(newControlProp, newControlPropComponentId)
    }
  }
  findControlRecursive(selectedProp, componentId)
  return {
    controlProp: finalControlProp,
    controlPropComponentId: finalControlPropComponentId,
  }
}

export const deleteCustomPropInRootComponent = (
  exposedProp: IProp,
  pages: IPages,
  componentsById: IComponentsById,
  customComponents: IComponents,
  propsById: IPropsByPageId,
  customComponentsProps: IProps,
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
    Object.keys(updatedCustomComponentProps.byComponentId).forEach(
      componentId => {
        updatedCustomComponentProps.byComponentId[componentId].forEach(
          propId => {
            if (
              updatedCustomComponentProps.byId[propId]
                .derivedFromComponentType === customComponentType &&
              updatedCustomComponentProps.byId[propId].derivedFromPropName ===
                derivedFromPropName
            )
              checkExposedPropInstance = true
          },
        )
      },
    )
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
          const components = updateInCustomComponent
            ? updatedCustomComponents
            : updatedComponentsById[componentsId]
          const props = updateInCustomComponent
            ? updatedCustomComponentProps
            : updatedPropsById[propsId]

          const propId =
            props.byComponentId[component.id]?.find(
              propId => props.byId[propId].name === derivedFromPropName,
            ) || ''
          const customProp = props.byId[propId]

          // we must not delete the custom prop if it uses the children of the instance of custom component(wrapper component)
          if (customProp.name !== 'children')
            deletePropById(propId, component.id, props)

          //Delete the component if the prop is custom children prop(derived prop of exposed children)
          if (components[customProp.value]) {
            const { updatedComponents, updatedProps } = deleteComp(
              components[customProp.value],
              components,
              updatedCustomComponentProps,
            )
            if (updateInCustomComponent) {
              updatedCustomComponentProps = updatedProps
              updatedCustomComponents = { ...updatedComponents }
            } else {
              updatedPropsById[propsId] = updatedProps
              updatedComponentsById[componentsId] = { ...updatedComponents }
            }
          }

          // If the custom prop is also exposed, we should take care of that too.
          if (updateInCustomComponent && customProp.derivedFromComponentType) {
            deleteCustomPropRecursive(customProp)
          }
        },
      )
    }
  }
  deleteCustomPropRecursive(exposedProp)
  return {
    updatedPropsById,
    updatedCustomComponentProps,
    updatedCustomComponents,
    updatedComponentsById,
  }
}
