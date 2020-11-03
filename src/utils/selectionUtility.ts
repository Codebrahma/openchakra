import { isKeyForComponent } from './reducerUtilities'
import { generateId } from './generateId'
import { omit } from 'lodash'

const addSpanForSelection = (
  childrenPropIndex: number,
  props: IPropsByComponentId,
  componentId: string,
  components: IComponents,
  selectionDetails: {
    start: number
    end: number
    startNodePosition: number
    endNodePosition: number
  },
) => {
  const { start, end, startNodePosition, endNodePosition } = selectionDetails
  const selectedComponentProps = props[componentId]
  let startValue =
    selectedComponentProps[childrenPropIndex].value[startNodePosition]
  let endValue =
    selectedComponentProps[childrenPropIndex].value[endNodePosition]
  const childrenProp = selectedComponentProps[childrenPropIndex]

  //selected left to right
  if (startNodePosition < endNodePosition) {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanChildrenPropIndex = props[startValue].findIndex(
        prop => prop.name === 'children',
      )
      const spanComponentId = startValue

      startValue = props[startValue][spanChildrenPropIndex].value
      startValue = startValue + endValue.substring(0, end)
      endValue = endValue.substring(end, endValue.length)

      props[spanComponentId][spanChildrenPropIndex].value = startValue
      props[spanComponentId][childrenPropIndex].value[
        endNodePosition
      ] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanChildrenPropIndex = props[endValue].findIndex(
        prop => prop.name === 'children',
      )
      const spanComponentId = endValue

      endValue = props[spanComponentId][spanChildrenPropIndex].value
      endValue = startValue.substring(start, startValue.length) + endValue
      startValue = startValue.substring(0, start)

      props[spanComponentId][childrenPropIndex].value[
        startNodePosition
      ] = startValue
      props[spanComponentId][spanChildrenPropIndex].value = endValue
    } else {
      let middleValue =
        props[componentId][childrenPropIndex].value[startNodePosition + 1]

      const spanComponentId = middleValue
      const spanChildrenPropIndex = props[spanComponentId].findIndex(
        prop => prop.name === 'children',
      )
      middleValue = props[spanComponentId][spanChildrenPropIndex].value

      middleValue =
        startValue.substring(start, startValue.length) +
        middleValue +
        endValue.substring(0, end)
      startValue = startValue.substring(0, start)
      endValue = endValue.substring(end, endValue.length)

      props[spanComponentId][childrenPropIndex].value[
        startNodePosition
      ] = startValue
      props[spanComponentId][childrenPropIndex].value[
        endNodePosition
      ] = endValue
      props[spanComponentId][spanChildrenPropIndex].value = middleValue
    }
  }
  //right to left
  else {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanComponentId = startValue
      const spanChildrenPropIndex = props[spanComponentId].findIndex(
        prop => prop.name === 'children',
      )

      startValue = props[spanComponentId][spanChildrenPropIndex].value
      startValue = endValue.substring(end, endValue.length) + startValue
      endValue = endValue.substring(0, end)

      props[spanComponentId][spanChildrenPropIndex].value = startValue
      props[spanComponentId][childrenPropIndex].value[
        endNodePosition
      ] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanComponentId = endValue
      const spanChildrenPropIndex = props[spanComponentId].findIndex(
        prop => prop.name === 'children',
      )
      endValue = props[spanComponentId][spanChildrenPropIndex].value
      endValue = endValue + startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)

      props[spanComponentId][childrenPropIndex].value[
        startNodePosition
      ] = startValue
      props[spanComponentId][spanChildrenPropIndex].value = endValue
    } else {
      let middleValue =
        props[componentId][childrenPropIndex].value[startNodePosition - 1]

      const spanComponentId = middleValue
      const spanChildrenPropIndex = props[spanComponentId].findIndex(
        prop => prop.name === 'children',
      )
      middleValue = props[spanComponentId][spanChildrenPropIndex].value

      middleValue =
        endValue.substring(end, endValue.length) +
        middleValue +
        startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)
      endValue = endValue.substring(0, end)

      props[spanComponentId][childrenPropIndex].value[
        startNodePosition
      ] = startValue
      props[spanComponentId][childrenPropIndex].value[
        endNodePosition
      ] = endValue
      props[spanComponentId][spanChildrenPropIndex].value = middleValue
    }
  }
}

const removeSpanForSelection = (
  childrenPropIndex: number,
  props: IPropsByComponentId,
  components: IComponents,
  selectedComponentId: string,
  selectionDetails: {
    start: number
    end: number
    startNodePosition: number
    endNodePosition: number
  },
) => {
  const { start, end, startNodePosition } = selectionDetails
  const childrenProp = props[selectedComponentId][childrenPropIndex]
  const spanId = childrenProp.value[startNodePosition]
  const spanChildrenPropIndex = props[spanId].findIndex(
    prop => prop.name === 'children',
  )
  const spanChildrenPropValue = props[spanId][spanChildrenPropIndex].value

  //Selected from beginning of the span to end of the span
  if (start === 0 && end === spanChildrenPropValue.length) {
    props = omit(props, spanId)
    delete components[spanId]
    components[selectedComponentId].children = components[
      selectedComponentId
    ].children.filter(child => child !== spanId)
    props[selectedComponentId][childrenPropIndex].value.splice(
      startNodePosition,
      1,
      spanChildrenPropValue,
    )
  }
  //Selected from beginning of the span to middle of the span
  else if (start === 0 && end !== spanChildrenPropValue.length) {
    props[selectedComponentId][childrenPropIndex].value[startNodePosition] = [
      spanChildrenPropValue.substring(start, end),
      props[selectedComponentId][childrenPropIndex].value[startNodePosition],
    ]
    props[selectedComponentId][
      spanChildrenPropIndex
    ].value = spanChildrenPropValue.substring(end, spanChildrenPropValue.length)
  }
  //Selected from middle of the span to end of the span
  else if (start !== 0 && end === spanChildrenPropValue.length) {
    props[selectedComponentId][childrenPropIndex].value[startNodePosition] = [
      props[selectedComponentId][childrenPropIndex].value[startNodePosition],
      spanChildrenPropValue.substring(start, end),
    ]
    props[selectedComponentId][
      spanChildrenPropIndex
    ].value = spanChildrenPropValue.substring(0, start)
  }
  //Selected in the middle of the span
  else {
    const id1 = generateId()
    const id2 = generateId()
    const filteredProps: IPropsByComponentId = omit(props, spanId)

    props[selectedComponentId][childrenPropIndex].value[startNodePosition] = [
      id1,
      spanChildrenPropValue.substring(start, end),
      id2,
    ]
    components[id1] = {
      ...components[spanId],
      id: id1,
    }
    components[id2] = {
      ...components[spanId],
      id: id2,
    }

    props = {
      ...props,
      id1: [],
      id2: [],
    }
    components[selectedComponentId].children = components[
      selectedComponentId
    ].children.filter(child => child !== spanId)
    components[selectedComponentId].children.push(id1)
    components[selectedComponentId].children.push(id2)

    Object.keys(filteredProps).forEach(componentId => {
      filteredProps[componentId].forEach((prop: IProp) => {
        if (prop.name === 'children') {
          props[id1].push({
            ...prop,
            id: generateId(),
            value: spanChildrenPropValue.substring(0, start),
          })
          props[id2].push({
            ...prop,
            id: generateId(),
            value: spanChildrenPropValue.substring(
              end,
              spanChildrenPropValue.length,
            ),
          })
        } else {
          props[id1].push({
            ...prop,
            id: generateId(),
          })
          props[id2].push({
            ...prop,
            id: generateId(),
          })
        }
      })
    })

    //delete the original component
    props = omit(props, spanId)
    delete components[spanId]
  }
  return props
}

export { addSpanForSelection, removeSpanForSelection }
