import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import BabelPluginGetComponents from '../babel-plugins/get-components-plugin/get-components'
import BabelPluginSetProp from '../babel-plugins/set-prop-plugin'

export const getComponentsState = (code: string) => {
  const plugin = new BabelPluginGetComponents()

  transform(code, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  return plugin.state
}

export const setProp = (
  code: string,
  options: { componentId: string; propName: string; value: string },
) =>
  transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelPluginSetProp, options]],
  })
