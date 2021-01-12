import * as t from '@babel/types'
import traverse from '@babel/traverse'

import { getComponentId } from './utils/babel-plugin-utils'

const unExposeProp = (
  _: any,
  options: {
    componentId: string
    exposedPropName: string
    exposedPropValue: string
    customPropName: string
  },
) => {
  const {
    componentId,
    exposedPropName,
    exposedPropValue,
    customPropName,
  } = options

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
            if (exposedPropValue.length > 0) {
              openingElement.attributes[exposedPropIndex] = t.jsxAttribute(
                t.jsxIdentifier(exposedPropName),
                t.stringLiteral(exposedPropValue),
              )
            } else {
              openingElement.attributes.splice(exposedPropIndex, 1)
            }
          }
        } else return
      },
    },
  }
}

export default unExposeProp
