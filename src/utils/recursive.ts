import omit from 'lodash/omit'
import { generateId } from './generateId'

export const duplicateComponent = (
  componentToClone: IComponent,
  components: IComponents,
  searchPropsRef?: boolean,
) => {
  const clonedComponents: IComponents = {}
  let props = {}

  const cloneComponent = (component: IComponent) => {
    const newid = generateId()
    const children = component.children.map(child => {
      return cloneComponent(components[child])
    })
    const propsRef = component.exposedProps
    if (searchPropsRef && propsRef)
      Object.values(propsRef).forEach((prop: PropRef) => {
        console.log(prop.customPropName)
        props = {
          ...props,
          [prop.customPropName]: prop.value,
        }
      })

    clonedComponents[newid] = {
      ...component,
      id: newid,
      props: { ...component.props },
      children,
    }

    children.forEach(child => {
      clonedComponents[child].parent = newid
    })

    return newid
  }

  const newId = cloneComponent(componentToClone)

  return {
    newId,
    clonedComponents,
    props,
  }
}

export const deleteComponent = (
  component: IComponent,
  components: IComponents,
) => {
  let updatedComponents = { ...components }
  const deleteRecursive = (
    children: IComponent['children'],
    id: IComponent['id'],
  ) => {
    children.forEach(child => {
      updatedComponents[child] &&
        deleteRecursive(updatedComponents[child].children, child)
    })

    updatedComponents = omit(updatedComponents, id)
  }

  deleteRecursive(component.children, component.id)
  updatedComponents = omit(updatedComponents, component.id)
  return updatedComponents
}

export const searchParent = (
  component: IComponent,
  components: IComponents,
  customComponentsList: string[],
) => {
  let foundParent = { ...component }
  const searchParentRecursive = (comp: IComponent) => {
    if (customComponentsList.indexOf(comp.type) === -1)
      searchParentRecursive(components[comp.parent])
    else foundParent = { ...comp }
  }
  searchParentRecursive(components[component.parent])
  return foundParent
}
