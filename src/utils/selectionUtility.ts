import { isKeyForComponent, deletePropsByComponentId } from './reducerUtilities'
import { generatePropId, generateComponentId } from './generateId'

/**
 * @method
 * @name addSpanForSelection
 * @description This function will add the span component based on the selected part in the text component.
 * @param {string} childrenPropId Id of the children prop
 * @param {IProps} props Props data
 * @param {IComponents} components Components data
 * @param {selectedTextDetails} payload
 */
const addSpanForSelection = (
  childrenPropId: string,
  props: IProps,
  components: IComponents,
  selectionDetails: {
    start: number
    end: number
    startNodePosition: number
    endNodePosition: number
  },
) => {
  const { start, end, startNodePosition, endNodePosition } = selectionDetails
  let startValue = props.byId[childrenPropId].value[startNodePosition]
  let endValue = props.byId[childrenPropId].value[endNodePosition]
  const childrenProp = props.byId[childrenPropId]

  //selected left to right
  if (startNodePosition < endNodePosition) {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanComponentId = startValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      startValue = props.byId[spanChildrenPropId].value
      startValue = startValue + endValue.substring(0, end)
      endValue = endValue.substring(end, endValue.length)

      props.byId[spanChildrenPropId].value = startValue
      props.byId[childrenPropId].value[endNodePosition] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanComponentId = endValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      endValue = props.byId[spanChildrenPropId].value
      endValue = startValue.substring(start, startValue.length) + endValue
      startValue = startValue.substring(0, start)

      props.byId[childrenPropId].value[startNodePosition] = startValue
      props.byId[spanChildrenPropId].value = endValue
    } else {
      let middleValue = props.byId[childrenPropId].value[startNodePosition + 1]

      const spanComponentId = middleValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      middleValue = props.byId[spanChildrenPropId].value

      middleValue =
        startValue.substring(start, startValue.length) +
        middleValue +
        endValue.substring(0, end)
      startValue = startValue.substring(0, start)
      endValue = endValue.substring(end, endValue.length)

      props.byId[childrenPropId].value[startNodePosition] = startValue
      props.byId[childrenPropId].value[endNodePosition] = endValue
      props.byId[spanChildrenPropId].value = middleValue
    }
  }
  //right to left
  else {
    if (isKeyForComponent(childrenProp.value[startNodePosition], components)) {
      const spanComponentId = startValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      startValue = props.byId[spanChildrenPropId].value
      startValue = endValue.substring(end, endValue.length) + startValue
      endValue = endValue.substring(0, end)

      props.byId[spanChildrenPropId].value = startValue
      props.byId[childrenPropId].value[endNodePosition] = endValue
    } else if (
      isKeyForComponent(childrenProp.value[endNodePosition], components)
    ) {
      const spanComponentId = endValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      endValue = props.byId[spanChildrenPropId].value
      endValue = endValue + startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)

      props.byId[childrenPropId].value[startNodePosition] = startValue
      props.byId[spanChildrenPropId].value = endValue
    } else {
      let middleValue = props.byId[childrenPropId].value[startNodePosition - 1]

      const spanComponentId = middleValue

      const spanChildrenPropId =
        props.byComponentId[spanComponentId].find(
          propId => props.byId[propId].name === 'children',
        ) || ''

      middleValue = props.byId[spanChildrenPropId].value

      middleValue =
        endValue.substring(end, endValue.length) +
        middleValue +
        startValue.substring(0, start)
      startValue = startValue.substring(start, startValue.length)
      endValue = endValue.substring(0, end)

      props.byId[childrenPropId].value[startNodePosition] = startValue
      props.byId[childrenPropId].value[endNodePosition] = endValue
      props.byId[spanChildrenPropId].value = middleValue
    }
  }
}

/**
 * @method
 * @name removeSpanForSelection
 * @description This function will remove the span component and convert to normal text value based on the selected part in the text component.
 * @param {string} childrenPropId Id of the children prop
 * @param {IProps} props Props data
 * @param {IComponents} components Components data
 * @param {selectedTextDetails} payload
 */
const removeSpanForSelection = (
  childrenPropId: string,
  props: IProps,
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
  const spanComponentId = props.byId[childrenPropId].value[startNodePosition]

  const spanChildrenPropId =
    props.byComponentId[spanComponentId].find(
      propId => props.byId[propId].name === 'children',
    ) || ''

  const spanChildrenPropValue = props.byId[spanChildrenPropId].value

  //Selected from beginning of the span to end of the span
  if (start === 0 && end === spanChildrenPropValue.length) {
    deletePropsByComponentId(spanComponentId, props)

    delete components[spanComponentId]
    components[selectedComponentId].children = components[
      selectedComponentId
    ].children.filter(child => child !== spanComponentId)
    props.byId[childrenPropId].value.splice(
      startNodePosition,
      1,
      spanChildrenPropValue,
    )
  }
  //Selected from beginning of the span to middle of the span
  else if (start === 0 && end !== spanChildrenPropValue.length) {
    props.byId[childrenPropId].value[startNodePosition] = [
      spanChildrenPropValue.substring(start, end),
      props.byId[childrenPropId].value[startNodePosition],
    ]
    props.byId[spanChildrenPropId].value = spanChildrenPropValue.substring(
      end,
      spanChildrenPropValue.length,
    )
  }
  //Selected from middle of the span to end of the span
  else if (start !== 0 && end === spanChildrenPropValue.length) {
    props.byId[childrenPropId].value[startNodePosition] = [
      props.byId[childrenPropId].value[startNodePosition],
      spanChildrenPropValue.substring(start, end),
    ]
    props.byId[spanChildrenPropId].value = spanChildrenPropValue.substring(
      0,
      start,
    )
  }
  //Selected in the middle of the span
  else {
    const spanComponentId1 = generateComponentId()
    const spanComponentId2 = generateComponentId()

    props.byId[childrenPropId].value[startNodePosition] = [
      spanComponentId1,
      spanChildrenPropValue.substring(start, end),
      spanComponentId2,
    ]
    components[spanComponentId1] = {
      ...components[spanComponentId],
      id: spanComponentId1,
    }
    components[spanComponentId2] = {
      ...components[spanComponentId],
      id: spanComponentId2,
    }

    props.byComponentId[spanComponentId1] = []
    props.byComponentId[spanComponentId2] = []

    components[selectedComponentId].children = components[
      selectedComponentId
    ].children.filter(child => child !== spanComponentId)
    components[selectedComponentId].children.push(spanComponentId1)
    components[selectedComponentId].children.push(spanComponentId2)

    props.byComponentId[spanComponentId].forEach(propId => {
      const prop = props.byId[propId]
      const newPropId1 = generatePropId()
      const newPropId2 = generatePropId()

      props.byComponentId[spanComponentId1].push(newPropId1)
      props.byComponentId[spanComponentId2].push(newPropId2)

      props.byId[newPropId1] = {
        ...prop,
        id: newPropId1,
        value:
          prop.name === 'children'
            ? spanChildrenPropValue.substring(0, start)
            : prop.value,
      }

      props.byId[newPropId2] = {
        ...prop,
        id: newPropId2,
        value:
          prop.name === 'children'
            ? spanChildrenPropValue.substring(end, spanChildrenPropValue.length)
            : prop.value,
      }
    })

    //delete the original component and its props
    delete components[spanComponentId]
    deletePropsByComponentId(spanComponentId, props)
  }
  return props
}

export { addSpanForSelection, removeSpanForSelection }
