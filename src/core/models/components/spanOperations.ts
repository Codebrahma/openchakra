import _ from 'lodash'

import {
  loadRequired,
  splitArray,
  joinAdjacentTextNodes,
} from '../../../utils/reducerUtilities'
import { generateId } from '../../../utils/generateId'
import {
  addSpanForSelection,
  removeSpanForSelection,
} from '../../../utils/selectionUtility'
import { ComponentsState } from './components'
import { ISelectedTextDetails } from './components-types'

export const addSpanComponent = (
  draftState: ComponentsState,
  payload: ISelectedTextDetails,
) => {
  const { props, components, selectedId: id } = loadRequired(draftState)

  const childrenPropIndex = props.findIndex(
    prop => prop.name === 'children' && prop.componentId === id,
  )
  const newId = generateId()
  const { startIndex, endIndex, startNodePosition, endNodePosition } = payload
  let start = startIndex
  let end = endIndex

  let croppedValue = ''

  //Only text node.
  if (startNodePosition === endNodePosition) {
    //  selected the text from right to left
    if (startIndex > endIndex) {
      start = endIndex
      end = startIndex
    }
    components[newId] = {
      id: newId,
      type: 'Box',
      children: [],
      parent: id,
    }

    components[id].children.push(newId)

    props.push({
      id: generateId(),
      componentId: newId,
      value: 'span',
      name: 'as',
      derivedFromComponentType: null,
      derivedFromPropName: null,
    })

    croppedValue = props[childrenPropIndex].value[startNodePosition].substring(
      start,
      end,
    )

    props[childrenPropIndex].value[startNodePosition] = splitArray({
      stringValue: props[childrenPropIndex].value[startNodePosition],
      start,
      end,
      id: newId,
    })

    props[childrenPropIndex].value = _.flatten(props[childrenPropIndex].value)
  }
  //Combination of text node and span node.
  else {
    addSpanForSelection(childrenPropIndex, props, components, {
      start,
      end,
      endNodePosition,
      startNodePosition,
    })
  }
  props[childrenPropIndex].value.filter((val: string) => val.length !== 0)

  props.push({
    id: generateId(),
    componentId: newId,
    value: croppedValue,
    name: 'children',
    derivedFromComponentType: null,
    derivedFromPropName: null,
  })
}

export const removeSpanComponent = (
  draftState: ComponentsState,
  payload: ISelectedTextDetails,
) => {
  const {
    components,
    isCustomComponentChild,
    propsId,
    selectedId: id,
  } = loadRequired(draftState)

  let props = isCustomComponentChild
    ? draftState.customComponentsProps
    : draftState.propsById[propsId]

  const { startIndex, endIndex, startNodePosition, endNodePosition } = payload

  let start = startIndex
  let end = endIndex

  //If selected the text from right to left
  if (startIndex > endIndex) {
    start = endIndex
    end = startIndex
  }

  const childrenPropIndex = props.findIndex(
    prop => prop.name === 'children' && prop.componentId === id,
  )

  props = removeSpanForSelection(childrenPropIndex, props, components, id, {
    start,
    end,
    startNodePosition,
    endNodePosition,
  })

  props[childrenPropIndex].value = _.flatten(props[childrenPropIndex].value)

  //join if there are adjacent text nodes.
  const propValue = joinAdjacentTextNodes(childrenPropIndex, components, props)
  props[childrenPropIndex].value = propValue

  if (isCustomComponentChild) draftState.customComponentsProps = props
  else draftState.propsById[propsId] = props
}

export const clearFormatting = (draftState: ComponentsState) => {
  const {
    components,
    isCustomComponentChild,
    propsId,
    selectedId: id,
  } = loadRequired(draftState)

  let props = isCustomComponentChild
    ? draftState.customComponentsProps
    : draftState.propsById[propsId]

  const childrenPropIndex = props.findIndex(
    prop => prop.name === 'children' && prop.componentId === id,
  )
  const childrenProp = props[childrenPropIndex]
  let newValue = ''

  if (Array.isArray(childrenProp.value)) {
    childrenProp.value.forEach((val: string) => {
      //if the value is the key for the components, then delete the component and replace it with value
      if (components[val]) {
        const spanChildrenValue =
          props.find(
            prop => prop.componentId === val && prop.name === 'children',
          )?.value || ''
        newValue = newValue + spanChildrenValue
        delete components[val]
        props = props.filter(prop => prop.componentId !== val)
      } else {
        newValue = newValue + val
      }
    })
  } else newValue = childrenProp.value

  props[childrenPropIndex].value = [newValue]

  if (isCustomComponentChild) draftState.customComponentsProps = [...props]
  else draftState.propsById[propsId] = [...props]
}
