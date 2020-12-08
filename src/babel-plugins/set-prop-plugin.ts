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

        if (visitedComponentId !== componentId) return

        const jsxAttribute = toJsxAttribute(propName, value)
        const existingAttrIndex = path.node.attributes.findIndex(
          (node: any) => node.name.name === propName,
        )
        if (existingAttrIndex !== -1) {
          if (value.length > 0) {
            path.node.attributes[existingAttrIndex] = jsxAttribute
          } else {
            // If the value is empty, remove the prop.
            path.node.attributes.splice(existingAttrIndex, 1)
          }
        } else {
          // Push the attribute only when the value is not empty.
          value.length > 0 && path.node.attributes.push(jsxAttribute)
        }
      },
    },
  }
}

export default setPropPlugin
