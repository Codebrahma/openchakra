import { RootState } from '../store'

export const getComponents = (state: RootState) => {
  return state.components.present.pages[state.components.present.selectedPage]
}

export const getCustomComponents = (state: RootState) =>
  state.components.present.customComponents

export const getCustomComponentsList = (state: RootState) =>
  state.components.present.customComponentList

export const getComponentBy = (nameOrId: string | IComponent['id']) => (
  state: RootState,
) =>
  getComponents(state)[nameOrId] ||
  state.components.present.customComponents[nameOrId]

export const getSelectedComponent = (state: RootState) => {
  return (
    getComponents(state)[state.components.present.selectedId] ||
    state.components.present.customComponents[
      state.components.present.selectedId
    ]
  )
}

export const getPropsForSelectedComponent = (
  state: RootState,
  propsName: string,
) => getComponents(state)[state.components.present.selectedId].props[propsName]

export const getSelectedComponentId = (state: RootState) =>
  state.components.present.selectedId

export const getIsSelectedComponent = (componentId: IComponent['id']) => (
  state: RootState,
) => state.components.present.selectedId === componentId

export const getSelectedComponentChildren = (state: RootState) => {
  return getSelectedComponent(state).children.map(child =>
    getComponentBy(child)(state),
  )
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
  state.components.present.selectedPage === 'custom' ? true : false
