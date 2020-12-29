import { getComponentId, toJsxAttribute } from './utils/babel-plugin-utils'
import template from '@babel/template'
import * as t from '@babel/types'
import componentsStructure from '../utils/defaultComponentStructure'

const addComponentPlugin = (
  _: any,
  options: {
    componentId: string
    parentId: string
    type: string
  },
) => {
  const { componentId, parentId, type } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          // Change the JSX element in the string to node template
          const node = template.ast(componentsStructure[type], {
            plugins: ['jsx'],
          }).expression

          // Convert to jsx attribute with compId as name.
          const jsxAttribute = toJsxAttribute('compId', componentId)

          node.openingElement.attributes.push(jsxAttribute)

          const newLineText = t.jsxText('\n')

          // Add to the children of the parent component
          if (path.node.children.length > 0) {
            path.node.children.push(node)
            path.node.children.push(newLineText)
          } else {
            path.node.children = [newLineText, node, newLineText]
          }
        }
      },
    },
  }
}

export default addComponentPlugin
