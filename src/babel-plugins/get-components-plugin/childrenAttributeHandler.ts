import * as t from '@babel/types'
import { getComponentId } from '../utils/babel-plugin-utils'
import { generatePropId } from '../../utils/generateId'
import { expressionContainerValueHandler } from './addProps'

const checkIsComponentSupportSpan = (
  componentType: string,
  componentChildren: any,
) => {
  const spanElements = ['Text', 'Heading']
  return (
    spanElements.includes(componentType) &&
    componentChildren.findIndex((child: any) => t.isJSXElement(child)) !== -1
  )
}

const IsValueContainOnlyWhiteSpace = (value: string) => !/\S/.test(value)

const childrenAttributeHandler = (
  path: any,
  props: IProps,
  payload: {
    componentId: string
    componentType: string
    functionName: string
  },
) => {
  const { componentId, componentType, functionName } = payload
  if (checkIsComponentSupportSpan(componentType, path.node.children)) {
    const childrenArray: string[] = []

    path.node.children.forEach((child: any) => {
      if (t.isJSXText(child)) {
        // white spaces will be added automatically at some places. So the value with only white spaces will not added.
        if (IsValueContainOnlyWhiteSpace(child.value)) return

        childrenArray.push(child.value)
      } else {
        const spanComponentId = getComponentId(child.openingElement)
        childrenArray.push(spanComponentId)
      }
    })
    const propId = generatePropId()

    props.byComponentId[componentId].push(propId)
    props.byId[propId] = {
      id: propId,
      name: 'children',
      value: childrenArray,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    }
  } else {
    path.node.children
      .filter(
        (child: any) => t.isJSXText(child) || t.isJSXExpressionContainer(child),
      )
      .forEach((child: any) => {
        const propId = generatePropId()
        if (t.isJSXText(child)) {
          // white spaces will be added automatically at some places. So the value with only white spaces will not added.
          if (IsValueContainOnlyWhiteSpace(child.value)) return

          props.byComponentId[componentId].push(propId)
          props.byId[propId] = {
            id: propId,
            name: 'children',
            value: child.value,
            derivedFromPropName: null,
            derivedFromComponentType: null,
          }
        } else {
          props.byComponentId[componentId].push(propId)
          props.byId[propId] = {
            id: propId,
            name: 'children',
            value: '',
            derivedFromPropName: null,
            derivedFromComponentType: null,
          }
          const {
            value: propValue,
            derivedFromPropName,
          } = expressionContainerValueHandler(path, child.expression)

          props.byId[propId].value = propValue

          if (derivedFromPropName) {
            props.byId[propId].derivedFromPropName = derivedFromPropName
            props.byId[propId].derivedFromComponentType = functionName

            // Add the custom prop to the root of the component.
            const newPropId = generatePropId()

            props.byComponentId[functionName].push(newPropId)

            props.byId[newPropId] = {
              id: newPropId,
              name: derivedFromPropName,
              value: '',
              derivedFromComponentType: null,
              derivedFromPropName: null,
            }
          }
        }
      })
  }
}

export default childrenAttributeHandler
