import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelPluginGetComponents from '../babel-plugins/get-components-plugin/get-components'
import * as componentsOperations from './components-operations'
import * as propsOperations from './props-operations'
import * as customComponentsOperations from './custom-components-operations'
import * as containerComponentsOperations from './container-components-operations'

const getComponentsState = (code: string) => {
  const plugin = new BabelPluginGetComponents()

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

export default {
  getComponentsState,
  ...componentsOperations,
  ...propsOperations,
  ...customComponentsOperations,
  ...containerComponentsOperations,
}
