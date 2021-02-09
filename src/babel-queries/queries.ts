import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelGenerateComponentsState from '../babel-plugins/generate-components-state/generate-components-state'
import BabelGetComponentsAndProps from '../babel-plugins/get-components-and-props'
import * as componentsOperations from './components-operations'
import * as propsOperations from './props-operations'
import * as customComponentsOperations from './custom-components-operations'
import * as containerComponentsOperations from './container-components-operations'

const generateComponentsState = (code: string) => {
  const plugin = new BabelGenerateComponentsState()

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

const getComponentsAndProps = (code: string, options: { parentId: string }) => {
  const plugin = new BabelGetComponentsAndProps(options)

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

export default {
  generateComponentsState,
  getComponentsAndProps,
  ...componentsOperations,
  ...propsOperations,
  ...customComponentsOperations,
  ...containerComponentsOperations,
}
