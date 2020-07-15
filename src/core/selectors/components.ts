import { RootState } from '../store'

export const getComponents = (state: RootState) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  return state.components.present.componentsById[componentsId]
}

export const getCustomComponents = (state: RootState) =>
  state.components.present.customComponents

export const getCustomComponentsList = (state: RootState) => {
  const customComponentsList: string[] = []
  Object.values(state.components.present.customComponents).forEach(comp => {
    if (comp.parent.length === 0) customComponentsList.push(comp.type)
  })
  return customComponentsList
}

export const getComponentBy = (nameOrId: string | IComponent['id']) => (
  state: RootState,
) =>
  isChildrenOfCustomComponent(nameOrId)(state)
    ? state.components.present.customComponents[nameOrId]
    : getComponents(state)[nameOrId]

export const getSelectedComponent = (state: RootState) => {
  return (
    getComponents(state)[state.components.present.selectedId] ||
    state.components.present.customComponents[
      state.components.present.selectedId
    ]
  )
}

export const getPropsForSelectedComponent = (state: RootState) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  return state.components.present.propsById[propsId].filter(
    prop => prop.componentId === state.components.present.selectedId,
  )
}

export const getPropsBy = (componentId: IComponent['id']) => (
  state: RootState,
) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  if (isChildrenOfCustomComponent(componentId)(state))
    return state.components.present.customComponentsProps.filter(
      prop => prop.componentId === componentId,
    )
  return state.components.present.propsById[propsId].filter(
    prop => prop.componentId === componentId,
  )
}

export const getSelectedComponentId = (state: RootState) =>
  state.components.present.selectedId

export const getIsSelectedComponent = (componentId: IComponent['id']) => (
  state: RootState,
) => state.components.present.selectedId === componentId

export const getSelectedComponentChildren = (state: RootState) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  const children: IComponent[] = []
  Object.values(state.components.present.componentsById[componentsId])
    .filter(
      component => component.parent === state.components.present.selectedId,
    )
    .forEach(component => children.push(getComponentBy(component.id)(state)))
  return children
}

export const getChildrenBy = (id: IComponent['id']) => (state: RootState) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  const components = isChildrenOfCustomComponent(id)(state)
    ? { ...state.components.present.customComponents }
    : { ...state.components.present.componentsById[componentsId] }
  const children: string[] = []
  Object.values(components)
    .filter(component => component.parent === id)
    .forEach(component => children.push(component.id))
  return children
}

export const getSelectedComponentParent = (state: RootState) =>
  getComponents(state)[getSelectedComponent(state).parent] ||
  state.components.present.customComponents[getSelectedComponent(state).parent]

export const getHoveredId = (state: RootState) =>
  state.components.present.hoveredId

export const getIsHovered = (id: IComponent['id']) => (state: RootState) =>
  getHoveredId(state) === id

export const isChildrenOfCustomComponent = (id: string | IComponent['id']) => (
  state: RootState,
) => {
  const selectedId = id || state.components.present.selectedId
  if (state.components.present.customComponents[selectedId] === undefined)
    return false
  else return true
}

export const getShowCustomComponentPage = (state: RootState) =>
  state.components.present.selectedPage === 'customPage' ? true : false

export const isInstanceOfCustomComponent = (id: string) => (
  state: RootState,
) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  if (state.components.present.componentsById[componentsId][id]) {
    const componentType =
      state.components.present.componentsById[componentsId][id].type
    if (state.components.present.customComponents[componentType]) return true
    return false
  }
  return false
}

export const getExposedPropsForSelectedComponent = (state: RootState) => {
  // const selectedComponent = getSelectedComponent(state)
  // if (selectedComponent) return selectedComponent.exposedProps
  // else return undefined
}

export const getPages = (state: RootState) => state.components.present.pages

export const getAllProps = (state: RootState) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  return state.components.present.propsById[propsId]
}

export const getCustomComponentsProps = (state: RootState) =>
  state.components.present.customComponentsProps
