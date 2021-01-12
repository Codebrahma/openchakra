import { getComponentId } from './utils/babel-plugin-utils'
import template from '@babel/template'
import * as t from '@babel/types'
import checkIsComponentId from '../utils/checkIsComponentId'

const addCustomComponentPlugin = (
  _: any,
  options: {
    componentId: string
    parentId: string
    type: string
    defaultProps: IProp[]
  },
) => {
  const { componentId, parentId, type, defaultProps } = options

  // If the value of the prop is a component-id, then the box component should be added.
  // or else its respective value will be added.
  const defaultPropsProvider = () => {
    return defaultProps
      .map(prop => {
        if (checkIsComponentId(prop.value)) {
          return `${prop.name}={<Box compId="${prop.value}"></Box>}`
        } else {
          return `${prop.name}="${prop.value}"`
        }
      })
      .join(' ')
  }

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          // Change the JSX element in the string to node template
          const component = `<${type} compId="${componentId}" ${defaultPropsProvider()}/>`

          const node = template.ast(component, {
            plugins: ['jsx'],
          }).expression
          const newLineText = t.jsxText('\n')

          // Add to the children of the parent component
          if (path.node.children.length > 0) {
            path.node.children.push(node)
            path.node.children.push(newLineText)
          } else {
            path.node.children = [newLineText, node, newLineText]
          }
        }
      },
    },
  }
}

export default addCustomComponentPlugin
