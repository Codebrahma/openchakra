import { getComponentId, toJsxAttribute } from './utils/babel-plugin-utils'

const setPropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
    value: string
  },
) => {
  const { componentId, propName, value } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId === componentId) {
          const jsxAttribute = toJsxAttribute(propName, value)
          const existingAttrIndex = path.node.attributes.findIndex(
            (node: any) => node.name.name === propName,
          )
          if (existingAttrIndex !== -1) {
            path.node.attributes[existingAttrIndex] = jsxAttribute
          } else {
            path.node.attributes.push(jsxAttribute)
          }
        }
      },
    },
  }
}

export default setPropPlugin
