import { createSelector } from 'reselect'
import { RootState } from '../store'
import { searchRootCustomComponent } from '../../utils/recursive'

export const getSelectedComponentId = (state: RootState): string =>
  state.components.present.selectedId

export const getSelectedPageComponents = (state: RootState): IComponents => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  return state.components.present.componentsById[componentsId]
}

export const getCustomComponents = (state: RootState): IComponents =>
  state.components.present.customComponents

// Gets all the components either from page components or custom components based on the component-id
export const getComponents = (componentId?: IComponent['id']) => (
  state: RootState,
) => {
  const selectedComponentId = componentId || state.components.present.selectedId

  return isChildrenOfCustomComponent(selectedComponentId)(state)
    ? getCustomComponents(state)
    : getSelectedPageComponents(state)
}

// Gets the list of custom components
export const getCustomComponentsList = (state: RootState): string[] => {
  const customComponentsList: string[] = []
  Object.values(state.components.present.customComponents).forEach(comp => {
    if (comp.parent.length === 0) customComponentsList.push(comp.type)
  })
  return customComponentsList
}

export const getComponentBy = (id: IComponent['id']) =>
  createSelector(getComponents(id), (components): IComponent => components[id])

export const getSelectedComponent = createSelector(
  getComponents(),
  getSelectedComponentId,
  (components, selectedId): IComponent => {
    return components[selectedId]
  },
)

export const getSelectedPageProps = (state: RootState): IProps => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  return state.components.present.propsById[propsId]
}

export const getCustomComponentsProps = (state: RootState): IProps =>
  state.components.present.customComponentsProps

export const getProps = (componentId?: IComponent['id']) => (
  state: RootState,
): IProps => {
  const selectedComponentId = componentId || state.components.present.selectedId
  return isChildrenOfCustomComponent(selectedComponentId)(state)
    ? getCustomComponentsProps(state)
    : getSelectedPageProps(state)
}

// Gets all the props either from page props or custom props based on the component-id
export const getPropsBy = (componentId?: IComponent['id']) =>
  createSelector(
    getSelectedComponentId,
    getProps(componentId),
    (selectedComponentId, props): IProp[] => {
      const selectedComponentProps: IProp[] = []
      const selectedCompId = componentId || selectedComponentId

      if (props.byComponentId[selectedCompId] !== undefined)
        props.byComponentId[selectedCompId].forEach(propId =>
          selectedComponentProps.push(props.byId[propId]),
        )

      return selectedComponentProps
    },
  )

export const getPropByName = (propName: string) =>
  createSelector(
    getSelectedComponentId,
    getProps(),
    (selectedComponentId, props): IProp => {
      const propId =
        props.byComponentId[selectedComponentId]?.find(
          propId => props.byId[propId].name === propName,
        ) || ''
      return props.byId[propId]
    },
  )

export const getIsSelectedComponent = (componentId: IComponent['id']) => (
  state: RootState,
): boolean => state.components.present.selectedId === componentId

export const getSelectedComponentChildren = (state: RootState) => {
  const selectedId = state.components.present.selectedId

  const components = getComponents(selectedId)(state)

  const customComponents = state.components.present.customComponents

  if (isInstanceOfCustomComponent(selectedId)(state)) {
    return customComponents[components[selectedId].type].children.map(
      child => customComponents[child],
    )
  }
  return components[selectedId].children.map(child => components[child])
}

export const getChildrenBy = (id: IComponent['id']) =>
  createSelector(
    getComponents(id),
    (components): string[] => components[id].children,
  )

export const getSelectedComponentParent = (state: RootState): IComponent =>
  getComponents()(state)[getSelectedComponent(state).parent]

export const getHoveredId = (state: RootState) =>
  state.components.present.hoveredId

export const getIsHovered = (id: IComponent['id']) => (
  state: RootState,
): boolean => getHoveredId(state) === id

// Find whether the component is a children of custom component
export const isChildrenOfCustomComponent = (id: string | IComponent['id']) => (
  state: RootState,
): boolean => {
  const selectedId = id || state.components.present.selectedId
  if (state.components.present.customComponents[selectedId] === undefined)
    return false
  else return true
}

// Check whether the page is custom components page or not.
export const getShowCustomComponentPage = (state: RootState): boolean =>
  state.components.present.selectedPage === 'customPage' ? true : false

// Checks whether the component is a instance of custom component
export const isInstanceOfCustomComponent = (id: string) => (
  state: RootState,
): boolean => {
  const components = getComponents(id)(state)
  const componentType = components[id].type

  return state.components.present.customComponents[componentType] ? true : false
}

// Gets all the components on all pages.
export const getAllTheComponents = (state: RootState): IComponentsById =>
  state.components.present.componentsById

export const getState = (state: RootState) => state.components.present

// Check whether the component is immediate(first) child of the custom component.
export const isImmediateChildOfCustomComponent = (component: IComponent) => (
  state: RootState,
) => {
  if (state.components.present.customComponents[component.id] === undefined)
    return false

  //Additional box for layout components
  if (component.parent === 'Prop') return false

  const parentComponent =
    state.components.present.customComponents[component.parent]
  return parentComponent.parent.length === 0 ? true : false
}

// Check whether the selected range includes two span elements.
export const isSelectedRangeContainsTwoSpan = (range: {
  start: number
  end: number
}) =>
  createSelector(
    [getComponents(), getPropByName('children')],
    (components, childrenProp) => {
      let spanElementCount = 0
      const { start, end } = range
      let startIndex = 0
      let endIndex = 0

      if (start === end) return false
      //left to right
      else if (start < end) {
        startIndex = start
        endIndex = end
      }
      //right to left
      else {
        startIndex = end
        endIndex = start
      }

      if (childrenProp && Array.isArray(childrenProp.value)) {
        for (let i = startIndex; i <= endIndex; i++) {
          if (components[childrenProp.value[i]])
            spanElementCount = spanElementCount + 1
        }
      }
      return spanElementCount > 1 ? true : false
    },
  )

// Check the prop value is the key of another component.
export const checkIsKeyForComponent = (prop: IProp, componentId: string) =>
  createSelector(getComponents(componentId), components => {
    return components[prop.value] ? true : false
  })

export const checkIsChildrenOfWrapperComponent = (id: string) => (
  state: RootState,
) => {
  if (state.components.present.customComponents[id]) {
    const rootParentComponentId = searchRootCustomComponent(
      state.components.present.customComponents[id],
      state.components.present.customComponents,
    )

    const propId = state.components.present.customComponentsProps.byComponentId[
      rootParentComponentId
    ]?.find(
      propId =>
        state.components.present.customComponentsProps.byId[propId].name ===
        'children',
    )

    return propId ? true : false
  } else return false
}

// If the custom component has the children prop, then it is a container component.
export const checkIsContainerComponent = (id: string) => (state: RootState) => {
  const components = getComponents(id)(state)
  const componentProps = getPropsBy(id)(state)

  const isChildrenPropPresent =
    componentProps &&
    componentProps.findIndex(prop => prop.name === 'children') !== -1

  const component = components[id]

  if (
    state.components.present.customComponents[component.type] !== undefined &&
    isChildrenPropPresent
  )
    return true
  else return false
}
