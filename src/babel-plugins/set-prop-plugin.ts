import * as t from '@babel/types'

import {
  getComponentId,
  toJsxAttribute,
  toJsxText,
  getJSXElement,
} from './utils/babel-plugin-utils'

export const checkIsIconProp = (propName: string, componentName: string) =>
  ['leftIcon', 'rightIcon', 'icon'].includes(propName) ||
  (componentName === 'Icon' && propName === 'as')

const setPropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
    value: string
  },
) => {
  const { componentId, propName, value } = options

  const buildIconProp = (name: string, value: string) => {
    // For this icon prop, <Icon as={copyIcon} /> is the correct format
    if (name === 'as') {
      return t.jsxAttribute(
        t.jsxIdentifier(name),
        t.jsxExpressionContainer(t.identifier(value)),
      )
    } else {
      // Other icon props, <IconButton icon={<SearchIcon />} /> is the correct format
      return t.jsxAttribute(
        t.jsxIdentifier(name),
        t.jsxExpressionContainer(getJSXElement(`<${value} />`)),
      )
    }
  }

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId !== componentId) return

        // If the prop is children, add it in the children attribute.
        // All the other props will be aded to attributes property
        if (propName === 'children') {
          if (path.container.children[0])
            path.container.children[0].value = value
          else {
            // If the children is not present, create a text Element and add it to the children.
            const jsxText = toJsxText(value)
            path.container.children.push(jsxText)
          }
          return
        }

        // For icon props, the attribute will be <Button leftIcon={<SearchIcon />}>Click</Button>.
        // For other props, the attribute value will be either string or number.
        const jsxAttribute = checkIsIconProp(propName, path.node.name.name)
          ? buildIconProp(propName, value)
          : toJsxAttribute(propName, value)

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
