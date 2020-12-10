import { getComponentId } from './utils/babel-plugin-utils'
import template from '@babel/template'
import { generateComponentId } from '../utils/generateId'

const addCustomComponentPlugin = (
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
        const componentId = generateComponentId()

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          // Change the JSX element in the string to node template
          const component = `<${type} compId="${componentId}"/>`
          const node = template.ast(component, {
            plugins: ['jsx'],
          }).expression

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

export default addCustomComponentPlugin
