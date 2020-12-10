import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import BabelPluginGetComponents from '../babel-plugins/get-components-plugin/get-components'
import BabelPluginSetProp from '../babel-plugins/set-prop-plugin'
import BabelSetComponentId from '../babel-plugins/set-componentId-plugin'
import BabelRemoveComponentId from '../babel-plugins/remove-componentId-plugin'
import BabelDeleteComponent from '../babel-plugins/delete-component-plugin'
import BabelDuplicateComponent from '../babel-plugins/duplicate-component-plugin'
import BabelAddComponent from '../babel-plugins/add-component-plugin'
import BabelReorderChildren from '../babel-plugins/reorder-children-plugin'
import BabelAddComponentImports from '../babel-plugins/add-imports-plugin'
import BabelMoveComponent from '../babel-plugins/move-component-plugin'
import BabelSaveComponent from '../babel-plugins/save-component-plugin'

const getComponentsState = (code: string) => {
  const plugin = new BabelPluginGetComponents()

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

const setProp = (
  code: string,
  options: { componentId: string; propName: string; value: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelPluginSetProp, options]],
  }).code
}

const setIdToComponents = (code: string) => {
  const transformed = transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelSetComponentId],
  })
  return transformed.code
}

const removeComponentId = (code: string) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelRemoveComponentId],
  }).code
}

const deleteComponent = (code: string, options: { componentId: string }) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteComponent, options]],
  }).code
}

const duplicateComponent = (code: string, options: { componentId: string }) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDuplicateComponent, options]],
  }).code
}

const addComponent = (
  code: string,
  options: { parentId: string; type: string },
) => {
  return transform(code, {
    plugins: [
      babelPluginSyntaxJsx,
      [BabelAddComponent, options],
      BabelSetComponentId,
    ],
  }).code
}

const reorderComponentChildren = (
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

const addComponentImports = (
  code: string,
  options: { components: string[] },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddComponentImports, options]],
  }).code
}

const moveComponent = (
  code: string,
  options: { componentId: string; newParentId: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelMoveComponent, options]],
  }).code
}

const saveComponent = (
  code: string,
  options: { componentId: string; customComponentName: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelSaveComponent, options]],
  }).code
}

export default {
  getComponentsState,
  setProp,
  setIdToComponents,
  removeComponentId,
  deleteComponent,
  duplicateComponent,
  addComponent,
  reorderComponentChildren,
  addComponentImports,
  moveComponent,
  saveComponent,
}
