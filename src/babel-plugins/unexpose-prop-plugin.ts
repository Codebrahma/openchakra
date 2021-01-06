import * as t from '@babel/types'
import { getComponentId } from './utils/babel-plugin-utils'

const unExposeProp = (
  _: any,
  options: {
    componentId: string
    customPropName: string
    exposedPropName: string
    exposedPropValue: string
  },
) => {
  const {
    customPropName,
    componentId,
    exposedPropName,
    exposedPropValue,
  } = options

  return {
    visitor: {
      ArrowFunctionExpression(path: any) {
        const componentName = path.parentPath.node.id.name

        // Only remove the params for the component, if it is a custom component.
        if (componentName === 'App') return

        // Get the properties for the function.
        const objectPatternProperties = path.node.params[0].properties

        const propertyIndex = objectPatternProperties.findIndex(
          (property: any) => property.key.name === customPropName,
        )

        // Remove the property
        objectPatternProperties.splice(propertyIndex, 1)

        if (objectPatternProperties.length === 0) path.node.params = []
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === componentId) {
          // replace the value with its old prop value.
          // For example : <Button bg={buttonColor}>Click</Button> to <Button bg='red.500'>Click</Button>

          // If it is children prop, change it in the children property or else change in the attributes for the component
          if (exposedPropName === 'children') {
            path.node.children = [t.jsxText(exposedPropValue)]
          } else {
            const exposedPropIndex = openingElement.attributes.findIndex(
              (node: any) => node.name.name === exposedPropName,
            )
            openingElement.attributes[exposedPropIndex] = t.jsxAttribute(
              t.jsxIdentifier(exposedPropName),
              t.stringLiteral(exposedPropValue),
            )
          }
        } else return
      },
    },
  }
}

export default unExposeProp
