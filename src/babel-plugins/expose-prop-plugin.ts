import * as t from '@babel/types'
import { getComponentId } from './utils/babel-plugin-utils'

const exposePropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
    targetedPropName: string
    defaultPropValue: string
  },
) => {
  const { propName, componentId, targetedPropName, defaultPropValue } = options

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
        // First we need to assign the parameters in the function definition.
        // For Example : const CustomButton=({buttonColor='red.500'})=><Button bg={buttonColor}>Hello world</Button>

        // First create the assignment pattern (buttonColor='red.500')
        const assignmentPattern = t.assignmentPattern(
          t.identifier(propName),
          t.stringLiteral(defaultPropValue),
        )

        // After creating the assignment pattern, create that to object property
        const objectProperty = t.objectProperty(
          t.identifier(propName),
          assignmentPattern,
        )

        // After creating the property, the property should be added to the properties section in the object pattern inside the params.
        if (path.node.params.length > 0) {
          const isPropAlreadyDefined =
            path.node.params[0].properties.findIndex(
              (property: any) => property.key.name === propName,
            ) !== -1

          // If the property is already present, don't add similar property. Only add when the property is not present

          if (!isPropAlreadyDefined) {
            path.node.params[0].properties.push(objectProperty)
          }
        } else {
          const objectPattern = t.objectPattern([objectProperty])
          path.node.params.push(objectPattern)
        }
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === componentId) {
          // Here the attribute value for the prop is replaced with the custom prop provided by the user.
          // For example : <Button bg='red.500'>Click me</Button> is converted to <Button bg={buttonColor}>Click me</Button>
          const value = t.jsxExpressionContainer(t.identifier(propName))
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
