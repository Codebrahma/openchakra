import traverse from '@babel/traverse'
import { getComponentId } from './utils/babel-plugin-utils'

const moveComponentPlugin = (
  _: any,
  options: {
    componentId: string
    newParentId: string
  },
) => {
  const { componentId, newParentId } = options

  if (componentId === newParentId) return {}

  return {
    visitor: {
      JSXElement(path: any) {
        const element = path.node
        const visitedComponentId = getComponentId(element.openingElement)

        if (visitedComponentId === newParentId) {
          // Get the root parent path. Thus we can find the element to move
          const rootParentPath = path.getFunctionParent()

          // Traverse and find the element and push the element in its new parent.
          traverse(
            rootParentPath.node,
            {
              JSXElement(path) {
                const openingElement = path.node.openingElement
                const visitedComponentId = getComponentId(openingElement)
                if (visitedComponentId === componentId) {
                  if (element.children) {
                    element.children.push(path.node)
                  } else {
                    element.children = [path.node]
                  }
                  // Remove the element from its original position
                  path.remove()
                }
              },
            },
            rootParentPath.scope,
            rootParentPath.state,
            rootParentPath,
          )
          // As The element is found, so we can stop all other traversing
          path.stop()
        }
      },
    },
  }
}

export default moveComponentPlugin
