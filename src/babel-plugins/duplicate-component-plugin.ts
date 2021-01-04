import * as t from '@babel/types'
import traverse from '@babel/traverse'
import {
  getComponentId,
  toJsxAttribute,
  getAttribute,
  addAttribute,
} from './utils/babel-plugin-utils'

const duplicateComponentPlugin = (
  _: any,
  options: {
    componentId: string
    componentIds: string[]
  },
) => {
  const { componentId, componentIds } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId && visitedComponentId === componentId) {
          const element = path.parentPath

          // Duplicate the node.
          const newElement = t.cloneDeep(element.node)

          // We need to change the component-id of each duplicated component.
          traverse(
            newElement,
            {
              JSXOpeningElement(path) {
                const idAttribute = getAttribute('compId', path.node)
                const newComponentId = componentIds.shift() || ''

                // If the id attribute is present, just change the value or else add the id attribute.
                if (idAttribute) {
                  idAttribute.value = t.stringLiteral(newComponentId)
                } else {
                  const newIdAttribute = toJsxAttribute(
                    'compId',
                    newComponentId,
                  )
                  addAttribute(newIdAttribute, path.node)
                }
              },
            },
            path.scope,
            path.state,
            path,
          )

          element.insertAfter(newElement)
        } else return
      },
    },
  }
}

export default duplicateComponentPlugin
