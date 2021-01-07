import * as t from '@babel/types'
import { getComponentId } from './utils/babel-plugin-utils'

const deleteCustomPropUtility = (
  _: any,
  options: {
    customPropName: string
    propsUsingCustomProp: IProps
  },
) => {
  const { customPropName, propsUsingCustomProp } = options

  return {
    visitor: {
      ArrowFunctionExpression(path: any) {
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

        // Check whether the visited component-id uses the custom prop
        if (
          propsUsingCustomProp.byComponentId[visitedComponentId] === undefined
        )
          return

        propsUsingCustomProp.byComponentId[visitedComponentId].forEach(
          propId => {
            const prop = propsUsingCustomProp.byId[propId]
            const { name, value } = prop
            const propValue = Array.isArray(value) ? value[0] : value

            // If the exposed prop is children, update the children
            // or else update the corresponding attribute
            if (prop.name === 'children') {
              path.node.children = [t.jsxText(propValue)]
            } else {
              const attributeIndex = openingElement.attributes.findIndex(
                (attribute: any) => attribute.name.name === name,
              )
              openingElement.attributes[attributeIndex] = t.jsxAttribute(
                t.jsxIdentifier(name),
                t.stringLiteral(propValue),
              )
            }
          },
        )
      },
    },
  }
}

export default deleteCustomPropUtility
