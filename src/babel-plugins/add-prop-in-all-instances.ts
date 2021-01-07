import { toJsxAttribute } from './utils/babel-plugin-utils'

const addPropInAllInstances = (
  _: any,
  options: {
    propName: string
    propValue: string
    componentName: string
  },
) => {
  const { propName, propValue, componentName } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentName = path.node.name.name

        if (visitedComponentName === componentName) {
          const jsxAttribute = toJsxAttribute(propName, propValue)

          path.node.attributes.push(jsxAttribute)
        } else return
      },
    },
  }
}

export default addPropInAllInstances
