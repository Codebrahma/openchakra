import { deleteComp } from './recursive'
import { generatePropId, generateComponentId } from './generateId'
import { ComponentsState } from '../core/models/components/components'

/**
 * Checks whether the component is the children of custom component
 * @param   {string} componentId  Id of the component
 * @param   {IComponents} customComponents custom components data
 * @return  {boolean}
 */
export function checkIsChildOfCustomComponent(
  componentId: string,
  customComponents: IComponents,
): boolean {
  if (customComponents[componentId]) return true
  return false
}

/**
 * @method
 * @name deletePropsById
 * @description Deletes the prop based on the prop-id
 * @param   {string} propId  Id of the props
 * @param   {string} componentId Id of the component
 * @param   {IProps} props props data
 */
export const deletePropById = (
  propId: string,
  componentId: string,
  props: IProps,
) => {
  const propIdIndex = props.byComponentId[componentId]?.findIndex(
    id => id === propId,
  )
  props.byComponentId[componentId]?.splice(propIdIndex, 1)
  delete props.byId[propId]
}

/**
 * @method
 * @name mergeProps
 * @description Merges the existing props with the new props data
 * @param   {IProps} originalCopyProps  Original props data
 * @param   {IProps} propsToMerge props that are to be merged with the original props data
 */
export const mergeProps = (originalCopyProps: IProps, propsToMerge: IProps) => {
  originalCopyProps.byId = {
    ...originalCopyProps.byId,
    ...propsToMerge.byId,
  }
  originalCopyProps.byComponentId = {
    ...originalCopyProps.byComponentId,
    ...propsToMerge.byComponentId,
  }
}

/**
 * @method
 * @name deletePropsByComponentId
 * @description Deletes all the props based on the component-id
 * @param   {string} componentId Id of the component
 * @param   {IProps} props props data
 */
export const deletePropsByComponentId = (
  componentId: string,
  props: IProps,
) => {
  props.byComponentId[componentId]?.forEach(propId => {
    delete props.byId[propId]
  })
  delete props.byComponentId[componentId]
}

/**
 * @method
 * @name duplicateProps
 * @description duplicates the props
 * @param   {IPropsById} propsById All the props with id as its key
 * @return  {IPropsById} duplicated props
 */
export const duplicateProps = (propsById: IPropsById): IPropsById => {
  const duplicatedProps: IPropsById = {}

  Object.values(propsById).forEach(prop => {
    const newPropId = generatePropId()
    duplicatedProps[newPropId] = {
      ...prop,
      id: newPropId,
    }
  })
  return duplicatedProps
}

/**
 * @method
 * @name isKeyForComponent
 * @description Checks wether the value of a prop is the key of another component.
 * @param   {string} value Prop value
 * @param   {IComponents} components  components data
 * @return  {boolean} duplicated props
 */
export const isKeyForComponent = (
  value: string,
  components: IComponents,
): boolean => {
  if (components[value]) return true
  return false
}

/**
 * @method
 * @name splitsValueToArray
 * @description Splits the value into array of values based on the start and end index.
 * @param   {string} propValue Prop value.
 * @param   {number} start  Start index to split the value.
 * @param   {number} end  end index to split the value.
 * @param   {string} spanId  Id of the span component.
 * @return  {string[]} duplicated props
 */
export const splitsValueToArray = (payload: {
  propValue: string
  start: number
  end: number
  spanId: string
}): string[] => {
  let splittedArray: string[] = []

  const { start, propValue, end, spanId } = payload

  if (start === 0 && end === propValue.length) splittedArray = [spanId]
  else if (start === 0 && end !== propValue.length)
    splittedArray = [spanId, propValue.substring(end, propValue.length)]
  else if (end === propValue.length && start !== 0)
    splittedArray = [propValue.substring(0, start), spanId]
  else
    splittedArray = [
      propValue.substring(0, start),
      spanId,
      propValue.substring(end, propValue.length),
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

/**
 * @method
 * @name joinAdjacentTextValues
 * @description This function will join the adjacent text values in the array.
 * @param   {IProp} value Prop value
 * @param   {IComponents} components  components data
 * @return  {string[]} Array of prop values
 */
export const joinAdjacentTextValues = (
  childrenProp: IProp,
  components: IComponents,
): string[] => {
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

    // Remove the prop-id in its component.
    // Remove the prop.
    const customPropIdIndex = props.byComponentId[component.id].findIndex(
      propId => propId === customPropId,
    )
    props.byComponentId[component.id].splice(customPropIdIndex, 1)

    delete props.byId[customPropId]

    if (customPropId && component.id !== component.type) {
      // Container component (the children from the instance of root component used by any of its custom components children)
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

  const boxId = generateComponentId()

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
    id: generatePropId(),
    name: 'height',
    value: '100%',
    derivedFromPropName: null,
    derivedFromComponentType: null,
  }

  const propId = generatePropId()
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
