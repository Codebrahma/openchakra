import { RootState } from '../store'
import { searchRootCustomComponent } from '../../utils/recursive'

export const getComponents = (state: RootState) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  return state.components.present.componentsById[componentsId]
}

export const getCustomComponents = (state: RootState) =>
  state.components.present.customComponents

//Used to get the components where the id is present.
export const getCurrentSelectedComponents = (componentId?: string) => (
  state: RootState,
) => {
  const id = componentId || state.components.present.selectedId
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId

  return isChildrenOfCustomComponent(id)(state)
    ? state.components.present.customComponents
    : state.components.present.componentsById[componentsId]
}

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
  const selectedId = state.components.present.selectedId

  const props = isChildrenOfCustomComponent(selectedId)(state)
    ? state.components.present.customComponentsProps
    : state.components.present.propsById[propsId]

  const selectedComponentProps: IProp[] = []

  props.byComponentId[selectedId].forEach(propId =>
    selectedComponentProps.push(props.byId[propId]),
  )

  return selectedComponentProps
}

export const getPropsBy = (componentId: IComponent['id']) => (
  state: RootState,
) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId

  const props = isChildrenOfCustomComponent(componentId)(state)
    ? state.components.present.customComponentsProps
    : state.components.present.propsById[propsId]

  const selectedComponentProps: IProp[] = []

  if (props.byComponentId[componentId] !== undefined)
    props.byComponentId[componentId].forEach(propId =>
      selectedComponentProps.push(props.byId[propId]),
    )

  return selectedComponentProps
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
  const selectedId = state.components.present.selectedId
  const components = isChildrenOfCustomComponent(selectedId)(state)
    ? { ...state.components.present.customComponents }
    : { ...state.components.present.componentsById[componentsId] }
  const customComponents = state.components.present.customComponents

  if (isInstanceOfCustomComponent(selectedId)(state)) {
    return customComponents[components[selectedId].type].children.map(
      child => customComponents[child],
    )
  }
  return components[selectedId].children.map(child => components[child])
}

export const getChildrenBy = (id: IComponent['id']) => (state: RootState) => {
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  const components = isChildrenOfCustomComponent(id)(state)
    ? { ...state.components.present.customComponents }
    : { ...state.components.present.componentsById[componentsId] }

  return components[id].children
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
  const components = isChildrenOfCustomComponent(id)(state)
    ? state.components.present.customComponents
    : state.components.present.componentsById[componentsId]
  if (components[id]) {
    const componentType = components[id].type
    if (state.components.present.customComponents[componentType]) return true
    return false
  }
  return false
}

export const getPages = (state: RootState) => state.components.present.pages

export const getProps = (state: RootState) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  return state.components.present.propsById[propsId]
}

export const getCustomComponentsProps = (state: RootState) =>
  state.components.present.customComponentsProps

export const getAllTheComponents = (state: RootState) =>
  state.components.present.componentsById

export const getState = (state: RootState) => state.components.present

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

export const getPropByName = (propName: string) => (state: RootState) => {
  const componentId = state.components.present.selectedId
  const isChildOfCustomComponent = isChildrenOfCustomComponent(componentId)(
    state,
  )
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId

  const props = isChildOfCustomComponent
    ? state.components.present.customComponentsProps
    : state.components.present.propsById[propsId]

  if (props.byComponentId[componentId]) {
    const propId =
      props.byComponentId[componentId].find(
        propId => props.byId[propId].name === propName,
      ) || ''
    return props.byId[propId]
  }

  return props.byId['']
}

export const isKeyForComponent = (
  value: string,
  componentIdSelected?: string,
) => (state: RootState) => {
  const id = componentIdSelected || state.components.present.selectedId

  const isChildOfCustomComponent = isChildrenOfCustomComponent(id)(state)
  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId

  const components = isChildOfCustomComponent
    ? state.components.present.customComponents
    : state.components.present.componentsById[componentsId]

  return components[value] ? true : false
}

export const isSelectedRangeContainsTwoSpan = (range: {
  start: number
  end: number
}) => (state: RootState) => {
  const childrenProp = getPropByName('children')(state)
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
      if (isKeyForComponent(childrenProp.value[i])(state))
        spanElementCount = spanElementCount + 1
    }
  }
  return spanElementCount > 1 ? true : false
}

export const checkIsKeyForComponent = (
  prop: IProp | undefined,
  componentId: string,
) => (state: RootState) => {
  if (prop === undefined) return false

  const componentsId =
    state.components.present.pages[state.components.present.selectedPage]
      .componentsId
  const components = isChildrenOfCustomComponent(componentId)(state)
    ? state.components.present.customComponents
    : state.components.present.componentsById[componentsId]
  if (components[prop.value]) return true
  else return false
}

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
    ].find(
      propId =>
        state.components.present.customComponentsProps.byId[propId].name ===
        'children',
    )

    return propId ? true : false
  } else return false
}

// If the custom component has the children prop, then it is a container component.
export const checkIsContainerComponent = (id: string) => (state: RootState) => {
  const components = getCurrentSelectedComponents(id)(state)
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

export const getPropIdByName = (propName: string, componentId?: string) => (
  state: RootState,
) => {
  const propsId =
    state.components.present.pages[state.components.present.selectedPage]
      .propsId
  const selectedId = componentId || state.components.present.selectedId

  const props = isChildrenOfCustomComponent(selectedId)(state)
    ? state.components.present.customComponentsProps
    : state.components.present.propsById[propsId]

  if (props.byComponentId[selectedId]) {
    const propId =
      props.byComponentId[selectedId].find(
        propId => props.byId[propId].name === propName,
      ) || ''
    return propId
  }
  return ''
}
