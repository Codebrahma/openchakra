import * as t from '@babel/types'
import traverse from '@babel/traverse'

import { getComponentId } from './utils/babel-plugin-utils'

const deleteCustomPropUtility = (
  _: any,
  options: {
    propsUsingCustomProp: IProps
    customPropName: string
  },
) => {
  const { propsUsingCustomProp, customPropName } = options

  return {
    visitor: {
      ArrowFunctionExpression(path: any) {
        const componentName = path.parentPath.node.id.name

        // Only remove the params for the component, if it is a custom component.
        if (componentName === 'App') return

        let isPropsUsed = false

        // Traverse and check whether any other component uses the props.
        traverse(
          path.parentPath.node,
          {
            MemberExpression(path: any) {
              if (
                path.node.object.name === 'props' &&
                path.node.property.name !== customPropName
              )
                isPropsUsed = true
            },
          },
          path.parentPath.scope,
          path.parentPath.state,
          path.parentPath,
        )

        if (!isPropsUsed) path.node.params = []
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
