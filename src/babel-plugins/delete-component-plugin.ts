import difference from 'lodash/difference'
import * as t from '@babel/types'
import traverse from '@babel/traverse'

import { getComponentId } from './utils/babel-plugin-utils'

const deleteComponentPlugin = (
  _: any,
  options: {
    componentId: string
    componentsToRemove: string[]
  },
) => {
  const { componentId, componentsToRemove } = options

  return {
    visitor: {
      ImportDeclaration(path: any) {
        if (path.node.source.value !== '@chakra-ui/core') return

        const importedComponents = path.node.specifiers.map(
          (specifier: any) => specifier.local.name,
        )

        // Example lets have a box. Box contains button and text.
        //First the box will be checked throughout the code, only if there is no other box component, only then the box is deleted.
        //The same goes for button and text component.
        const filteredComponentNames = componentsToRemove.filter(
          componentName => {
            let compInstanceCount = 0
            traverse(
              path.parentPath.node,
              {
                JSXOpeningElement(path: any) {
                  if (path.node.name.name === componentName)
                    compInstanceCount = compInstanceCount + 1
                },
              },
              path.parentPath.scope,
              path.parentPath.state,
              path.parentPath,
            )
            if (compInstanceCount > 1) return null
            else return componentName
          },
        )

        // Remove the components that are
        const updatedImports = difference(
          importedComponents,
          filteredComponentNames,
        )

        path.node.specifiers = updatedImports.map(component =>
          t.importSpecifier(t.identifier(component), t.identifier(component)),
        )
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
