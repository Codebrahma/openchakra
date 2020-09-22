import { isKeyForComponent } from './reducerUtilities'
import { generateId } from './generateId'

const addSpanForSelection = (
  childrenPropIndex: number,
  props: IProp[],
  components: IComponents,
  selectionDetails: {
    start: number
    end: number
    startNodePosition: number
    endNodePosition: number
  },
) => {
  const { start, end, startNodePosition, endNodePosition } = selectionDetails
  let startValue = props[childrenPropIndex].value[startNodePosition]
  let endValue = props[childrenPropIndex].value[endNodePosition]
  const childrenProp = props[childrenPropIndex]

  //selected left to right
  if (startNodePosition < endNodePosition) {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === startValue && prop.name === 'children',
      )

      startValue = props[spanChildrenPropIndex].value
      startValue = startValue + endValue.substring(0, end)
      endValue = endValue.substring(end, endValue.length)

      props[spanChildrenPropIndex].value = startValue
      props[childrenPropIndex].value[endNodePosition] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === endValue && prop.name === 'children',
      )
      endValue = props[spanChildrenPropIndex].value
      endValue = startValue.substring(start, startValue.length) + endValue
      startValue = startValue.substring(0, start)

      props[childrenPropIndex].value[startNodePosition] = startValue
      props[spanChildrenPropIndex].value = endValue
    } else {
      let middleValue = props[childrenPropIndex].value[startNodePosition + 1]
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === middleValue && prop.name === 'children',
      )
      middleValue = props[spanChildrenPropIndex].value

      middleValue =
        startValue.substring(start, startValue.length) +
        middleValue +
        endValue.substring(0, end)
      startValue = startValue.substring(0, start)
      endValue = endValue.substring(end, endValue.length)

      props[childrenPropIndex].value[startNodePosition] = startValue
      props[childrenPropIndex].value[endNodePosition] = endValue
      props[spanChildrenPropIndex].value = middleValue
    }
  }
  //right to left
  else {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === startValue && prop.name === 'children',
      )

      startValue = props[spanChildrenPropIndex].value
      startValue = endValue.substring(end, endValue.length) + startValue
      endValue = endValue.substring(0, end)

      props[spanChildrenPropIndex].value = startValue
      props[childrenPropIndex].value[endNodePosition] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === endValue && prop.name === 'children',
      )
      endValue = props[spanChildrenPropIndex].value
      endValue = endValue + startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)

      props[childrenPropIndex].value[startNodePosition] = startValue
      props[spanChildrenPropIndex].value = endValue
    } else {
      let middleValue = props[childrenPropIndex].value[startNodePosition - 1]
      const spanChildrenPropIndex = props.findIndex(
        prop => prop.componentId === middleValue && prop.name === 'children',
      )
      middleValue = props[spanChildrenPropIndex].value

      middleValue =
        endValue.substring(end, endValue.length) +
        middleValue +
        startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)
      endValue = endValue.substring(0, end)

      props[childrenPropIndex].value[startNodePosition] = startValue
      props[childrenPropIndex].value[endNodePosition] = endValue
      props[spanChildrenPropIndex].value = middleValue
    }
  }
}

const removeSpanForSelection = (
  childrenPropIndex: number,
  props: IProp[],
  components: IComponents,
  selectedId: string,
  selectionDetails: {
    start: number
    end: number
    startNodePosition: number
    endNodePosition: number
  },
) => {
  const { start, end, startNodePosition } = selectionDetails
  const childrenProp = props[childrenPropIndex]
  const spanId = childrenProp.value[startNodePosition]
  const spanChildrenPropIndex = props.findIndex(
    prop => prop.componentId === spanId && prop.name === 'children',
  )
  const spanChildrenPropValue = props[spanChildrenPropIndex].value

  //Selected from beginning of the span to end of the span
  if (start === 0 && end === spanChildrenPropValue.length) {
    props = props.filter(prop => prop.componentId !== spanId)
    delete components[spanId]
    components[selectedId].children = components[selectedId].children.filter(
      child => child !== spanId,
    )
    props[childrenPropIndex].value.splice(
      startNodePosition,
      1,
      spanChildrenPropValue,
    )
  }
  //Selected from beginning of the span to middle of the span
  else if (start === 0 && end !== spanChildrenPropValue.length) {
    props[childrenPropIndex].value[startNodePosition] = [
      spanChildrenPropValue.substring(start, end),
      props[childrenPropIndex].value[startNodePosition],
    ]
    props[spanChildrenPropIndex].value = spanChildrenPropValue.substring(
      end,
      spanChildrenPropValue.length,
    )
  }
  //Selected from middle of the span to end of the span
  else if (start !== 0 && end === spanChildrenPropValue.length) {
    props[childrenPropIndex].value[startNodePosition] = [
      props[childrenPropIndex].value[startNodePosition],
      spanChildrenPropValue.substring(start, end),
    ]
    props[spanChildrenPropIndex].value = spanChildrenPropValue.substring(
      0,
      start,
    )
  }
  //Selected in the middle of the span
  else {
    const id1 = generateId()
    const id2 = generateId()
    const filteredProps = props.filter(prop => prop.componentId === spanId)

    props[childrenPropIndex].value[startNodePosition] = [
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
    components[selectedId].children = components[selectedId].children.filter(
      child => child !== spanId,
    )
    components[selectedId].children.push(id1)
    components[selectedId].children.push(id2)
    props = [
      ...props,
      ...filteredProps.map(prop => {
        if (prop.name === 'children') {
          return {
            ...prop,
            id: generateId(),
            componentId: id1,
            value: spanChildrenPropValue.substring(0, start),
          }
        }
        return {
          ...prop,
          id: generateId(),
          componentId: id1,
        }
      }),
      ...filteredProps.map(prop => {
        if (prop.name === 'children') {
          return {
            ...prop,
            id: generateId(),
            componentId: id2,
            value: spanChildrenPropValue.substring(
              end,
              spanChildrenPropValue.length,
            ),
          }
        }
        return {
          ...prop,
          id: generateId(),
          componentId: id2,
        }
      }),
    ]

    //delete the original component
    props = props.filter(prop => prop.componentId !== spanId)
    delete components[spanId]
  }
  return props
}

export { addSpanForSelection, removeSpanForSelection }
