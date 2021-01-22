import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelPluginGetComponents from '../babel-plugins/get-components-plugin/get-components'
import BabelRemoveMovedComponentFromSource from '../babel-plugins/move-component-plugin/remove-component'
import BabelInsertMovedComponentToDest from '../babel-plugins/move-component-plugin/insert-moved-component-plugin'
import BabelReassignComponentId from '../babel-plugins/reassign-componentId'
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

const exportToCustomComponentsPage = (
  pageCode: string,
  customComponentsPageCode: string,
  options: { componentId: string; componentIds: string[] },
) => {
  // First the component is fetched from the Page code source.
  const plugin = new BabelRemoveMovedComponentFromSource({
    componentId: options.componentId,
  })

  transform(pageCode, {
    plugins: [babelPluginSyntaxJsx, plugin.plugin],
  })

  // The component-id's for the components are reassigned.
  const modifiedComponentCode = transform(plugin.removedComponent, {
    plugins: [
      babelPluginSyntaxJsx,
      [BabelReassignComponentId, { componentIds: options.componentIds }],
    ],
  }).code

  // The component code with the reassigned componentIds are added as the children to the root of the custom components page.
  const updatedCustomComponentsCode = transform(customComponentsPageCode, {
    plugins: [
      babelPluginSyntaxJsx,
      [
        BabelInsertMovedComponentToDest,
        {
          parentId: 'root',
          componentToInsert: modifiedComponentCode,
        },
      ],
    ],
  }).code

  return updatedCustomComponentsCode
}

export default {
  getComponentsState,
  exportToCustomComponentsPage,
  ...componentsOperations,
  ...propsOperations,
  ...customComponentsOperations,
  ...containerComponentsOperations,
}
