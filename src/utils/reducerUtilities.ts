import { deleteComp } from './recursive'
import { generateId } from './generateId'
import { ComponentsState } from '../core/models/components/components'

export function checkIsChildOfCustomComponent(
  componentId: string,
  customComponents: IComponents,
) {
  if (customComponents[componentId]) return true
  return false
}

export const duplicateProps = (props: IPropsById) => {
  const duplicatedProps: IPropsById = {}

  Object.values(props).forEach(prop => {
    const newPropId = generateId()
    duplicatedProps[newPropId] = {
      ...prop,
      id: newPropId,
    }
  })
  return duplicatedProps
}

export const isKeyForComponent = (value: string, components: IComponents) => {
  if (components[value]) return true
  return false
}

export const splitArray = (payload: {
  stringValue: string
  start: number
  end: number
  id: string
}) => {
  let splittedArray = []

  const { start, stringValue, end, id } = payload

  if (start === 0 && end === stringValue.length) splittedArray = [id]
  else if (start === 0 && end !== stringValue.length)
    splittedArray = [id, stringValue.substring(end, stringValue.length)]
  else if (end === stringValue.length && start !== 0)
    splittedArray = [stringValue.substring(0, start), id]
  else
    splittedArray = [
      stringValue.substring(0, start),
      id,
      stringValue.substring(end, stringValue.length),
    ]

  return splittedArray
}

export const updateInAllInstances = (
  pages: IPages,
  componentsById: IComponentsById,
  customComponents: IComponents,
  typeToFilter: string,
  updateCallBack: any,
) => {
  Object.values(pages).forEach(page =>
    Object.values(componentsById[page.componentsId])
      .filter(component => component.type === typeToFilter)
      .forEach(component =>
        updateCallBack(component, false, page.propsId, page.componentsId),
      ),
  )

  Object.values(customComponents)
    .filter(component => component.type === typeToFilter)
    .forEach(component => updateCallBack(component, true))
}

// joining the adjacent text in the array
export const joinAdjacentTextNodes = (
  childrenProp: IProp,
  components: IComponents,
) => {
  const propValue: string[] = []

  childrenProp.value.forEach((val: string) => {
    if (propValue.length === 0 || isKeyForComponent(val, components)) {
      propValue.push(val)
    } else {
      if (!isKeyForComponent(propValue[propValue.length - 1], components)) {
        propValue[propValue.length - 1] = propValue[propValue.length - 1] + val
      } else {
        propValue.push(val)
      }
    }
  })
  return propValue
}

export const deleteCustomPropUtility = (
  component: IComponent,
  propName: string,
  components: IComponents,
  props: IProps,
) => {
  const customPropId = props.byComponentId[component.id].find(
    id => props.byId[id].name === propName,
  )

  if (customPropId) {
    const customProp = props.byId[customPropId]

    delete props.byComponentId[component.id]
    delete props.byId[customPropId]

    if (customPropId && component.id !== component.type) {
      // Wrapper-components
      if (customProp.name === 'children') {
        components[component.id].children.length > 0 &&
          components[component.id].children.forEach(child => {
            const { updatedComponents, updatedProps } = deleteComp(
              components[child],
              components,
              props,
            )
            return {
              props: updatedProps,
              components: updatedComponents,
            }
          })
        components[component.id].children = []
      }
      // Layout-components
      if (components[customProp.value]) {
        const { updatedComponents, updatedProps } = deleteComp(
          components[customProp.value],
          components,
          props,
        )

        return {
          props: updatedProps,
          components: updatedComponents,
        }
      }
    }
  }
  return {
    props: props,
    components: components,
  }
}

export const loadRequired = (state: ComponentsState, componentId?: string) => {
  const componentsId = state.pages[state.selectedPage].componentsId
  const propsId = state.pages[state.selectedPage].propsId
  const selectedId = state.selectedId
  const isCustomComponentChild = checkIsChildOfCustomComponent(
    componentId || selectedId,
    state.customComponents,
  )
  return {
    componentsId,
    propsId,
    selectedId,
    isCustomComponentChild,
    components: isCustomComponentChild
      ? state.customComponents
      : state.componentsById[componentsId],
    props: isCustomComponentChild
      ? state.customComponentsProps
      : state.propsById[propsId],
  }
}

export const isContainerComponentChildrenExposed = (
  propName: string,
  type: string,
) => {
  return propName === 'children' && (type === 'Box' || type === 'Flex')
}

//If the children of the box or flex is exposed, we have to set the id of the box component
//where we can add components.
export const addCustomPropsInAllComponentInstances = (payload: {
  exposedProp: {
    name: string
    customPropName: string
    value: string
  }
  exposedPropComponentType: string
  component: IComponent
  updateInCustomComponent: Boolean
  propsId: string
  componentsId: string
  draftState: ComponentsState
}) => {
  const {
    exposedProp,
    exposedPropComponentType,
    componentsId,
    component,
    propsId,
    draftState,
    updateInCustomComponent,
  } = payload

  const boxId = generateId()

  const boxComponent = {
    id: boxId,
    type: 'Box',
    parent: 'Prop',
    children: [],
  }

  const isBoxChildrenExposed = isContainerComponentChildrenExposed(
    exposedProp.name,
    exposedPropComponentType,
  )
  const heightProp = {
    id: generateId(),
    name: 'height',
    value: '100%',
    derivedFromPropName: null,
    derivedFromComponentType: null,
  }

  const propId = generateId()
  const prop = {
    id: propId,
    name: exposedProp.customPropName || '',
    value: isBoxChildrenExposed ? boxId : exposedProp.value,
    derivedFromPropName: null,
    derivedFromComponentType: null,
  }

  if (updateInCustomComponent) {
    draftState.customComponentsProps.byComponentId[component.id]?.push(propId)
    draftState.customComponentsProps.byId[propId] = { ...prop }

    if (isBoxChildrenExposed) {
      draftState.customComponents[boxId] = boxComponent
      draftState.customComponentsProps.byComponentId[boxId]?.push(heightProp.id)
      draftState.customComponentsProps.byId[heightProp.id] = { ...heightProp }
    }
  } else {
    draftState.propsById[propsId].byComponentId[component.id]?.push(propId)
    draftState.propsById[propsId].byId[propId] = { ...prop }

    if (isBoxChildrenExposed) {
      draftState.componentsById[componentsId][boxId] = boxComponent
      draftState.propsById[propsId].byComponentId[boxId]?.push(heightProp.id)
      draftState.propsById[propsId].byId[heightProp.id] = { ...heightProp }
    }
  }
}
