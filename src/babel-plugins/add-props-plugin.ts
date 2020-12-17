import { getComponentId, toJsxAttribute } from './utils/babel-plugin-utils'
import convertToProperPropName from '../utils/convertToProperPropName'

const addPropsPlugin = (
  _: any,
  options: {
    componentId: string
    propsToBeAdded: any
  },
) => {
  const { componentId, propsToBeAdded } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId !== componentId) return

        Object.keys(propsToBeAdded).forEach(propKey => {
          const value = propsToBeAdded[propKey]
          const propName = convertToProperPropName(propKey)

          // If the value is number, convert it to number.
          const propValue =
            value.length > 0 && !isNaN(value) ? parseInt(value, 10) : value

          const jsxAttribute = toJsxAttribute(propName, propValue)
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
        })
      },
    },
  }
}

export default addPropsPlugin
