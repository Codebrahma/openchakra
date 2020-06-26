import omit from 'lodash/omit'
import { generateId } from './generateId'

export const duplicateComponent = (
  componentToClone: IComponent,
  components: IComponents,
  fetchExposedProps?: boolean,
) => {
  const clonedComponents: IComponents = {}
  let customComponentProps = {}

  const cloneComponent = (component: IComponent) => {
    const newid = generateId()
    const children = component.children.map(child => {
      return cloneComponent(components[child])
    })
    const exposedProps = component.exposedProps
    if (fetchExposedProps && exposedProps)
      Object.values(exposedProps).forEach((prop: PropRef) => {
        customComponentProps = {
          ...customComponentProps,
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
    customComponentProps,
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
    if (
      customComponentsList.length > 0 &&
      customComponentsList.indexOf(comp.type) === -1
    )
      searchParentRecursive(components[comp.parent])
    else foundParent = { ...comp }
  }
  searchParentRecursive(components[component.parent])
  return foundParent
}

export const findChildrenImports = (
  parentComponent: IComponent,
  customComponents: IComponents,
) => {
  const childrenImports: Array<string> = []
  const findChildrenImportRecursive = (component: IComponent) => {
    childrenImports.push(component.type)
    component.children.forEach(child =>
      findChildrenImportRecursive(customComponents[child]),
    )
  }
  findChildrenImportRecursive(customComponents[parentComponent.children[0]])
  return childrenImports
}

export const updateCustomComponentProps = (
  components: IComponents,
  component: IComponent,
  parentComponent: IComponent,
) => {
  const props = parentComponent.props
  const exposedPropsChildren = parentComponent.exposedPropsChildren
  const updateCustomComponentPropsRecursive = (comp: IComponent) => {
    if (comp.exposedProps) {
      Object.values(comp.exposedProps).forEach((exposedProp: PropRef) => {
        props[exposedProp.customPropName] = exposedProp.value || ''
        exposedPropsChildren[exposedProp.customPropName] = exposedPropsChildren[
          exposedProp.customPropName
        ]
          ? exposedPropsChildren[exposedProp.customPropName].push(component.id)
          : [component.id]
      })
    } else {
      comp.children.forEach(child =>
        updateCustomComponentPropsRecursive(components[child]),
      )
    }
  }
  updateCustomComponentPropsRecursive(component)
  return {
    updatedProps: props,
    updatedExposedPropsChildren: exposedPropsChildren,
  }
}

export const deleteCustomComponentProps = (
  components: IComponents,
  component: IComponent,
  parentComponent: IComponent,
) => {
  const props = parentComponent.props
  const exposedPropsChildren = parentComponent.exposedPropsChildren
  const deleteCustomComponentPropsRecursive = (comp: IComponent) => {
    if (comp.exposedProps) {
      Object.values(comp.exposedProps).forEach((exposedProp: PropRef) => {
        if (
          exposedPropsChildren &&
          exposedPropsChildren[exposedProp.customPropName]
        ) {
          exposedPropsChildren[exposedProp.customPropName].splice(
            exposedPropsChildren[exposedProp.customPropName].indexOf(comp.id),
          )
          console.log(exposedPropsChildren)

          if (exposedPropsChildren[exposedProp.customPropName].length === 0) {
            delete exposedPropsChildren[exposedProp.customPropName]
            delete props[exposedProp.customPropName]
          }
        }
      })
    } else {
      comp.children.forEach(child =>
        deleteCustomComponentPropsRecursive(components[child]),
      )
    }
  }
  deleteCustomComponentPropsRecursive(component)
  return {
    updatedProps: props,
    updatedExposedPropsChildren: exposedPropsChildren,
  }
}
