import { getComponentId } from './utils/babel-plugin-utils'
import * as t from '@babel/types'

const reorderChildrenPlugin = (
  _: any,
  options: {
    componentId: string
    fromIndex: number
    toIndex: number
  },
) => {
  const { componentId, fromIndex, toIndex } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)

        if (visitedComponentId && visitedComponentId === componentId) {
          const children = path.node.children.filter((node: any) =>
            t.isJSXElement(node),
          )
          const [removed] = children.splice(fromIndex, 1)
          children.splice(toIndex, 0, removed)
          path.node.children = children
        } else return
      },
    },
  }
}

export default reorderChildrenPlugin
