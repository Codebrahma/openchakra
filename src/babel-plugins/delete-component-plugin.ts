import { getComponentId } from './utils/babel-plugin-utils'
import removeSpecifiedImports from './utils/removeSpecifiedImports'
import { IComponentsUsed } from './get-used-components'

const deleteComponentPlugin = (
  _: any,
  options: {
    componentId: string
    componentsToRemove: IComponentsUsed
  },
) => {
  const { componentId, componentsToRemove } = options

  return {
    visitor: {
      ImportDeclaration(path: any) {
        removeSpecifiedImports(path, componentsToRemove)
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId === componentId) {
          path.remove()
        } else return
      },
    },
  }
}

export default deleteComponentPlugin
