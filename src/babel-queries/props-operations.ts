import { transform } from '@babel/standalone'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'

import BabelPluginSetProp from '../babel-plugins/set-prop-plugin'
import BabelSetComponentId from '../babel-plugins/set-componentId-plugin'
import BabelRemoveComponentId from '../babel-plugins/remove-componentId-plugin'
import BabelSetChildrenProp, {
  ISpanComponentsValues,
} from '../babel-plugins/set-children-prop-plugin'
import BabelAddProps from '../babel-plugins/add-props-plugin'
import BabelDeleteProp from '../babel-plugins/delete-prop-plugin'
import BabelRemovePropInAllElements from '../babel-plugins/removePropInAllElement'

export const setProp = (
  code: string,
  options: { componentId: string; propName: string; value: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelPluginSetProp, options]],
  }).code
}

export const setIdToComponents = (code: string) => {
  const transformed = transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelSetComponentId],
  })
  return transformed.code
}

export const removeComponentId = (code: string) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, BabelRemoveComponentId],
  }).code
}

export const addProps = (
  code: string,
  options: { componentId: string; propsToBeAdded: any },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelAddProps, options]],
  }).code
}

export const deleteProp = (
  code: string,
  options: { componentId: string; propName: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelDeleteProp, options]],
  }).code
}

export const setChildrenProp = (
  code: string,
  options: {
    componentId: string
    value: string[]
    spanComponentsValues: ISpanComponentsValues
  },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelSetChildrenProp, options]],
  }).code
}

export const removePropInAllComponents = (
  code: string,
  options: { propName: string },
) => {
  return transform(code, {
    plugins: [babelPluginSyntaxJsx, [BabelRemovePropInAllElements, options]],
  }).code
}
