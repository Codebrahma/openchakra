import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelDeleteComponent from '../babel-plugins/delete-component-plugin'
import BabelDuplicateComponent from '../babel-plugins/duplicate-component-plugin'
import BabelAddComponent from '../babel-plugins/add-component-plugin'
import BabelReorderChildren from '../babel-plugins/reorder-children-plugin'
import BabelRemoveMovedComponentFromSource from '../babel-plugins/move-component-plugin/remove-component'
import BabelInsertMovedComponentToDest from '../babel-plugins/move-component-plugin/insert-moved-component-plugin'
import BabelAddMetaComponent from '../babel-plugins/add-meta-component-plugin'

export const deleteComponent = (
  code: string,
  options: { componentId: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteComponent, options]],
  }).code
}

export const duplicateComponent = (
  code: string,
  options: { componentId: string; componentIds: string[] },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDuplicateComponent, options]],
  }).code
}

export const addComponent = (
  code: string,
  options: { componentId: string; parentId: string; type: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddComponent, options]],
  }).code
}

export const addMetaComponent = (
  code: string,
  options: { componentIds: string[]; parentId: string; type: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddMetaComponent, options]],
  }).code
}

export const reorderComponentChildren = (
  code: string,
  options: {
    componentId: string
    fromIndex: number
    toIndex: number
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelReorderChildren, options]],
  }).code
}

// Here two babel plugins are used.
// One plugin is used to remove the specified component from its parent and it will return the removed component.
// Another plugin is used to insert the removed component in its new component
export const moveComponent = (
  sourceCode: string,
  destinationCode: string,
  options: { componentId: string; destParentId: string },
) => {
  const plugin = new BabelRemoveMovedComponentFromSource({
    componentId: options.componentId,
  })

  const transformedSource = transform(sourceCode, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  // If the source and destination code is same, the transformed code from the source is used here.
  // Because we need to perform both remove component from old parent and insert component in new parent in same code
  const transformedDest = transform(
    sourceCode === destinationCode ? transformedSource.code : destinationCode,
    {
      plugins: [
        babelPluginSyntaxJsx,
        [
          BabelInsertMovedComponentToDest,
          {
            parentId: options.destParentId,
            componentToInsert: plugin.removedComponent,
          },
        ],
      ],
    },
  )

  return {
    updatedSourceCode: transformedSource.code,
    updatedDestCode: transformedDest.code,
  }
}