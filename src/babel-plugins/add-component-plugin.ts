import template from '@babel/template'
import * as t from '@babel/types'
import union from 'lodash/union'

import { getComponentId } from './utils/babel-plugin-utils'

export interface IComponentIds {
  [type: string]: string
}

const addComponentPlugin = (
  _: any,
  options: {
    parentId: string
    componentsToImport: string[]
    componentCode: string
  },
) => {
  const { componentCode, parentId, componentsToImport } = options

  return {
    visitor: {
      ImportDeclaration(path: any) {
        if (path.node.source.value !== '@chakra-ui/core') return

        const importedComponents = path.node.specifiers.map(
          (specifier: any) => specifier.local.name,
        )

        const components = union(importedComponents, componentsToImport)

        path.node.specifiers = components.map(component =>
          t.importSpecifier(t.identifier(component), t.identifier(component)),
        )
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId !== parentId) {
          return
        }
        // Change the JSX element in the string to node template
        const node = template.ast(componentCode, {
          plugins: ['jsx'],
        }).expression

        const newLineText = t.jsxText('\n')

        // Add to the children of the parent component
        if (path.node.children.length > 0) {
          path.node.children.push(node)
          path.node.children.push(newLineText)
        } else {
          path.node.children = [newLineText, node, newLineText]
        }
      },
    },
  }
}

export default addComponentPlugin
