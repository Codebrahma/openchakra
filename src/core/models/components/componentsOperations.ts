import { DEFAULT_ID } from './components-types'
import { generateId } from '../../../utils/generateId'
import { DEFAULT_PROPS } from '../../../utils/defaultProps'
import {
  loadRequired,
  joinAdjacentTextNodes,
} from '../../../utils/reducerUtilities'
import {
  deleteCustomPropInRootComponent,
  deleteComp,
  duplicateComp,
} from '../../../utils/recursive'
import { ComponentsState } from './components'

export const addComponent = (
  draftState: ComponentsState,
  payload: { parentId: string; type: ComponentType },
) => {
  const id = generateId()
  const { parentId, type } = payload
  const {
    isCustomComponentChild,
    propsId,
    components,
    componentsId,
  } = loadRequired(draftState, parentId)
  const defaultProps: IProp[] = []

  //Add the default props for the component.
  DEFAULT_PROPS[type] &&
    Object.keys(DEFAULT_PROPS[type]).forEach((propName: string) => {
      defaultProps.push({
        id: generateId(),
        name: propName,
        value: DEFAULT_PROPS[type][propName],
        componentId: id,
        derivedFromPropName: null,
        derivedFromComponentType: null,
      })
    })
  components[id] = {
    id,
    type: type,
    parent: parentId,
    children: [],
  }
  if (isCustomComponentChild) {
    draftState.customComponentsProps = [
      ...draftState.customComponentsProps,
      ...defaultProps,
    ]
    draftState.customComponents[parentId].children.push(id)
  } else {
    draftState.propsById[propsId] = [
      ...draftState.propsById[propsId],
      ...defaultProps,
    ]
    draftState.componentsById[componentsId][parentId].children.push(id)
  }
}

export const addMetaComponent = (
  draftState: ComponentsState,
  payload: { components: IComponents; root: string; parent: string },
) => {
  const { components: metaComponents, root, parent } = payload
  const { isCustomComponentChild, propsId, componentsId } = loadRequired(
    draftState,
    parent,
  )
  const metaComponentsDefaultProps: IProp[] = []

  //Add the default props for the components
  Object.values(metaComponents).forEach(component => {
    DEFAULT_PROPS[component.type as ComponentType] &&
      Object.keys(DEFAULT_PROPS[component.type as ComponentType]).forEach(
        (propName: string) => {
          metaComponentsDefaultProps.push({
            id: generateId(),
            name: propName,
            value: DEFAULT_PROPS[component.type as ComponentType][propName],
            componentId: component.id,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          })
        },
      )
  })

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...draftState.customComponents,
      ...metaComponents,
    }
    draftState.customComponentsProps = [
      ...draftState.customComponentsProps,
      ...metaComponentsDefaultProps,
    ]
    draftState.customComponents[root].parent = parent
    draftState.customComponents[parent].children.push(root)
  } else {
    draftState.componentsById[componentsId] = {
      ...draftState.componentsById[componentsId],
      ...metaComponents,
    }
    draftState.propsById[propsId] = [
      ...draftState.propsById[propsId],
      ...metaComponentsDefaultProps,
    ]
    draftState.componentsById[componentsId][root].parent = parent
    draftState.componentsById[componentsId][parent].children.push(root)
  }
}

export const deleteComponent = (
  draftState: ComponentsState,
  payload: {
    componentId: string
    parentId: string
  },
) => {
  const {
    isCustomComponentChild,
    componentsId,
    components,
    props,
    propsId,
  } = loadRequired(draftState)
  const { componentId, parentId } = payload

  const { updatedComponents, updatedProps, deletedProps } = deleteComp(
    components[componentId],
    components,
    props,
  )
  updatedComponents[parentId].children = updatedComponents[
    parentId
  ].children.filter(child => child !== componentId)

  if (updatedComponents[parentId].type === 'Text') {
    const childrenPropIndex = updatedProps.findIndex(
      prop => prop.componentId === parentId && prop.name === 'children',
    )
    updatedProps[childrenPropIndex].value = updatedProps[
      childrenPropIndex
    ].value.filter((val: string) => val !== componentId)

    const propValue = joinAdjacentTextNodes(
      childrenPropIndex,
      components,
      props,
    )
    updatedProps[childrenPropIndex].value = propValue
  }

  draftState.selectedId = DEFAULT_ID
  if (isCustomComponentChild) {
    draftState.customComponents = updatedComponents
    draftState.customComponentsProps = updatedProps

    //deletion of custom props for the exposed props that are deleted
    deletedProps
      .filter(prop => prop.derivedFromPropName)
      .forEach(customProp => {
        const {
          updatedCustomComponentProps,
          updatedPropsById,
          updatedComponentsById,
          updatedCustomComponents,
        } = deleteCustomPropInRootComponent(
          customProp,
          draftState.pages,
          draftState.componentsById,
          draftState.customComponents,
          draftState.propsById,
          draftState.customComponentsProps,
        )
        draftState.propsById = { ...updatedPropsById }
        draftState.customComponentsProps = [...updatedCustomComponentProps]
        draftState.componentsById = { ...updatedComponentsById }
        draftState.customComponents = { ...updatedCustomComponents }
      })
  } else {
    draftState.propsById[propsId] = [...updatedProps]
    draftState.componentsById[componentsId] = { ...updatedComponents }

    deletedProps
      .filter(prop => draftState.componentsById[componentsId][prop.value])
      .forEach(prop => {
        const { updatedComponents, updatedProps } = deleteComp(
          draftState.componentsById[componentsId][prop.value],
          draftState.componentsById[componentsId],
          draftState.propsById[propsId],
        )
        draftState.propsById[propsId] = [...updatedProps]
        draftState.componentsById[componentsId] = { ...updatedComponents }
      })
  }
}

export const duplicateComponent = (
  draftState: ComponentsState,
  selectedComponent: IComponent,
) => {
  const {
    isCustomComponentChild,
    propsId,
    componentsId,
    components,
    props,
  } = loadRequired(draftState)

  const { newId, clonedComponents, clonedProps } = duplicateComp(
    selectedComponent,
    components,
    props,
  )
  const childrenPropIndex = props.findIndex(
    prop =>
      prop.componentId === selectedComponent.parent && prop.name === 'children',
  )
  components[selectedComponent.parent].children.push(newId)

  components[selectedComponent.parent].type === 'Text' &&
    props[childrenPropIndex].value.push(newId)

  if (isCustomComponentChild) {
    draftState.customComponents = {
      ...components,
      ...clonedComponents,
    }
    draftState.customComponentsProps = [...props, ...clonedProps]
  } else {
    draftState.componentsById[componentsId] = {
      ...components,
      ...clonedComponents,
    }
    draftState.propsById[propsId] = [...props, ...clonedProps]
  }
}