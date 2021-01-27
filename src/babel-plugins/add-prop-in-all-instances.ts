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
  // If the prop boxId is present, then it denotes that children prop is exposed.
  // And the custom prop will hold jsx element
  // For example : <Layout top={<Box><Text>Hello world</Text></Box>} bottom={<Box><Button>Click me</Button></Box>}/>
  const { propName, propValue, componentName, boxId } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentName = path.node.name.name

        if (visitedComponentName === componentName) {
          if (boxId) {
            const boxComponent = `<Box compId="${boxId}"></Box>`

            const element = getJSXElement(boxComponent)

            const jsxAttribute = t.jsxAttribute(
              t.jsxIdentifier(propName),
              t.jsxExpressionContainer(element),
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
