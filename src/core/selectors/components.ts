import { RootState } from '../store'

export const getComponents = (state: RootState) =>
  state.components.present.components

export const getCustomComponents = (state: RootState) =>
  state.components.present.customComponents

export const getCustomComponentsList = (state: RootState) =>
  state.components.present.customComponentList

export const getComponentBy = (nameOrId: string | IComponent['id']) => (
  state: RootState,
) =>
  state.components.present.components[nameOrId] ||
  state.components.present.customComponents[nameOrId]

export const getSelectedComponent = (state: RootState) =>
  state.components.present.components[state.components.present.selectedId] ||
  state.components.present.customComponents[state.components.present.selectedId]

export const getPropsForSelectedComponent = (
  state: RootState,
  propsName: string,
) =>
  state.components.present.components[state.components.present.selectedId]
    .props[propsName]

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
  state.components.present.components[getSelectedComponent(state).parent] ||
  state.components.present.customComponents[getSelectedComponent(state).parent]

export const getHoveredId = (state: RootState) =>
  state.components.present.hoveredId

export const getIsHovered = (id: IComponent['id']) => (state: RootState) =>
  getHoveredId(state) === id

export const isSelectedIdCustomComponent = (state: RootState) =>
  state.components.present.customComponents[
    state.components.present.selectedId
  ] === undefined
    ? false
    : true
