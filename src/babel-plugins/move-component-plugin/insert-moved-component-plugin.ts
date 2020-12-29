import { getComponentId } from '../utils/babel-plugin-utils'
import template from '@babel/template'

const insertMovedComponentPlugin = (
  _: any,
  options: {
    parentId: string
    componentToInsert: string
  },
) => {
  const { parentId, componentToInsert } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          const node = template.ast(componentToInsert, {
            plugins: ['jsx'],
          }).expression

          // Add to the children of the parent component
          if (path.node.children) {
            path.node.children.push(node)
          } else {
            path.node.children = [node]
          }
        } else return
      },
    },
  }
}

export default insertMovedComponentPlugin
