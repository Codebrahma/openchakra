import { getComponentId } from './utils/babel-plugin-utils'
import template from '@babel/template'
import componentsStructure from '../utils/defaultComponentStructure'

const addComponentPlugin = (
  _: any,
  options: {
    parentId: string
    type: string
  },
) => {
  const { parentId, type } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          // Change the JSX element in the string to node template
          const node = template.ast(componentsStructure[type], {
            plugins: ['jsx'],
          })

          // Add to the children of the parent component
          if (path.node.children) {
            path.node.children.push(node)
          } else {
            path.node.children = [node]
          }
        }
      },
    },
  }
}

export default addComponentPlugin
