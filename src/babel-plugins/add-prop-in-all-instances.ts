import * as t from '@babel/types'
import { toJsxAttribute, getJSXElement } from './utils/babel-plugin-utils'

const addPropInAllInstances = (
  _: any,
  options: {
    propName: string
    propValue: string
    componentName: string
    boxId?: string
  },
) => {
  const { propName, propValue, componentName, boxId } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentName = path.node.name.name

        if (visitedComponentName === componentName) {
          if (boxId) {
            const boxComponent = `<Box compId="${boxId}"></Box>`

            const expressionStatement = getJSXElement(boxComponent)

            const jsxAttribute = t.jsxAttribute(
              t.jsxIdentifier(propName),
              t.jsxExpressionContainer(expressionStatement.expression),
            )
            path.node.attributes.push(jsxAttribute)
          } else {
            const jsxAttribute = toJsxAttribute(propName, propValue)
            path.node.attributes.push(jsxAttribute)
          }
        } else return
      },
    },
  }
}

export default addPropInAllInstances
