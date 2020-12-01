import * as t from '@babel/types'

import { getComponentId } from './utils/babel-plugin-utils'

const setPropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
    value: string
  },
) => {
  const { componentId, propName, value } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId === componentId) {
          // Convert to jsx attribute using propName and prop-value
          const jsxAttribute = t.jsxAttribute(
            t.jsxIdentifier(propName),
            t.stringLiteral(value),
          )
          const existingAttrIndex = path.node.attributes.findIndex(
            (node: any) => node.name.name === propName,
          )
          if (existingAttrIndex !== -1) {
            path.node.attributes[existingAttrIndex] = jsxAttribute
          } else {
            path.node.attributes.push(jsxAttribute)
          }
        }
      },
    },
  }
}

export default setPropPlugin
