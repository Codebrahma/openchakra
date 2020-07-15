// import omit from 'lodash/omit'
import { generateId } from './generateId'

export const duplicateComponent = (
  componentId: string,
  sourceComponents: IComponents,
  destinationComponents: IComponents,
  sourceProps: IProp[],
  destinationProps: IProp[],
) => {
  let updatedSourceComponents = { ...sourceComponents }
  let updatedDestinationComponents = { ...destinationComponents }
  let updatedDestinationProps = [...destinationProps]

  function duplicateRecursive(compId: string) {
    //find the children of the component
    //the components whose parent is the component(to move) are the children components

    Object.values(updatedSourceComponents)
      .filter(comp => comp.parent === compId)
      .forEach(comp => {
        duplicateRecursive(comp.id)
      })
    console.log(compId)
    updatedDestinationProps = [
      ...updatedDestinationProps,
      ...sourceProps.filter(prop => prop.componentId === compId),
    ]

    updatedDestinationComponents = {
      ...updatedDestinationComponents,
      [compId]: {
        ...updatedSourceComponents[compId],
      },
    }
  }

  duplicateRecursive(componentId)
  return {
    updatedDestinationComponents,
    updatedDestinationProps,
  }
}

export const deleteComp = (
  component: IComponent,
  components: IComponents,
  props: IProp[],
) => {
  let updatedComponents = { ...components }
  let updatedProps = [...props]

  function deleteRecursive(component: IComponent) {
    //find the children of the component
    //the components whose parent is the component(to delete) are the children components
    Object.values(components)
      .filter(comp => comp.parent === component.id)
      .forEach(comp => {
        deleteRecursive(comp)
      })
    delete updatedComponents[component.id]
    if (updatedProps.length > 0)
      updatedProps = updatedProps.filter(
        prop => prop.componentId !== component.id,
      )
  }

  deleteRecursive(component)

  return { updatedComponents, updatedProps }
}

// export const findChildrenImports = (
//   parentComponent: IComponent,
//   customComponents: IComponents,
// ) => {
//   const childrenImports: Array<string> = []
//   const findChildrenImportRecursive = (component: IComponent) => {
//     childrenImports.push(component.type)
//     component.children.forEach(child =>
//       findChildrenImportRecursive(customComponents[child]),
//     )
//   }
//   findChildrenImportRecursive(customComponents[parentComponent.children[0]])
//   return childrenImports
// }

export const fetchAndUpdateExposedProps = (
  rootParentId: string,
  component: IComponent,
  components: IComponents,
  props: IProp[],
) => {
  let rootParentProps: IProp[] = []
  let updatedProps = [...props]
  const fetchAndUpdateExposedPropsRecursive = (comp: IComponent) => {
    Object.values(components)
      .filter(filteredComp => filteredComp.parent === comp.id)
      .forEach(comp => {
        fetchAndUpdateExposedPropsRecursive(comp)
      })

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
  destinationComponents: IComponents,
  sourceProps: IProp[],
  destinationProps: IProp[],
) => {
  let updatedSourceComponents = { ...sourceComponents }
  let updatedDestinationComponents = { ...destinationComponents }
  let updatedSourceProps = [...sourceProps]
  let updatedDestinationProps = [...destinationProps]

  function moveRecursive(compId: string) {
    //find the children of the component
    //the components whose parent is the component(to move) are the children components

    Object.values(updatedSourceComponents)
      .filter(comp => comp.parent === compId)
      .forEach(comp => {
        moveRecursive(comp.id)
      })
    console.log(compId)
    updatedDestinationProps = [
      ...updatedDestinationProps,
      ...sourceProps.filter(prop => prop.componentId === compId),
    ]
    updatedSourceProps = updatedSourceProps.filter(
      prop => prop.componentId !== compId,
    )
    updatedDestinationComponents = {
      ...updatedDestinationComponents,
      [compId]: {
        ...updatedSourceComponents[compId],
      },
    }
    delete updatedSourceComponents[compId]
  }

  moveRecursive(componentId)
  return {
    updatedSourceComponents,
    updatedDestinationComponents,
    updatedSourceProps,
    updatedDestinationProps,
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
