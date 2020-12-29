import traverse from '@babel/traverse'
import template from '@babel/template'
import * as t from '@babel/types'

import { getComponentId, toJsxAttribute } from './utils/babel-plugin-utils'
import componentsStructure from '../utils/defaultComponentStructure'

export interface IComponentIds {
  [type: string]: string
}

const addMetaComponentPlugin = (
  _: any,
  options: {
    componentIds: IComponentIds
    parentId: string
    type: string
  },
) => {
  const { componentIds, parentId, type } = options

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

          // Traverse into the node and assign component-id prop to every element
          traverse(
            node,
            {
              JSXOpeningElement(path: any) {
                const componentName = path.node.name.name
                const componentId = componentIds[componentName]

                const compIdAttribute = toJsxAttribute('compId', componentId)
                path.node.attributes.push(compIdAttribute)
              },
            },
            path.scope,
            path,
          )

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

export default addMetaComponentPlugin
