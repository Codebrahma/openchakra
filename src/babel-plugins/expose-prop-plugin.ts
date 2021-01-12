import * as t from '@babel/types'

import { getComponentId } from './utils/babel-plugin-utils'

const exposePropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
    targetedPropName: string
  },
) => {
  const { propName, componentId, targetedPropName } = options

  const setAttributeValue = (
    openingElement: any,
    attributeName: string,
    attributeValue: any,
  ) => {
    const targetedPropIndex = openingElement.attributes.findIndex(
      (node: any) => node.name.name === attributeName,
    )
    if (targetedPropIndex !== -1) {
      openingElement.attributes[targetedPropIndex] = t.jsxAttribute(
        t.jsxIdentifier(attributeName),
        attributeValue,
      )
    } else {
      const attribute = t.jsxAttribute(
        t.jsxIdentifier(attributeName),
        attributeValue,
      )
      openingElement.attributes.push(attribute)
    }
  }

  return {
    visitor: {
      ArrowFunctionExpression(path: any) {
        const componentName = path.parentPath.node.id.name

        // Only update the params for the component, if it is a custom component.
        if (componentName === 'App') return

        if (path.node.params.length === 0) {
          path.node.params = [t.identifier('props')]
        }
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === componentId) {
          // member expression means accessing object. For example : props.value
          const memberExpression = t.memberExpression(
            t.identifier('props'),
            t.identifier(propName),
          )

          // Here converting to <Button>{props.value}</Button>
          const value = t.jsxExpressionContainer(memberExpression)

          if (targetedPropName === 'children') {
            path.node.children = [value]
          } else {
            setAttributeValue(openingElement, targetedPropName, value)
          }
        } else return
      },
    },
  }
}

export default exposePropPlugin
