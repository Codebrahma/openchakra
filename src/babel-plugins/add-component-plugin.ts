import { getComponentId, toJsxAttribute } from './utils/babel-plugin-utils'
import template from '@babel/template'
import { generateComponentId } from '../utils/generateId'

const components: any = {
  Box: `<Box></Box>`,
  Text: `<Text>Text value</Text>`,
  Button: `<Button>Button Text</Button>`,
  Heading: `<Heading>Heading Text</Heading>`,
  Badge: `<Badge>Badge</Badge>`,
  Avatar: `<Avatar />`,
  Checkbox: `<Checkbox>Label checkbox</Checkbox>`,
  Flex: `<Flex></Flex>`,
}

const addComponentIdAttribute = (node: any) => {
  const componentId = generateComponentId()
  const jsxAttribute = toJsxAttribute('compId', componentId)

  if (node.expression.openingElement.attributes) {
    node.expression.openingElement.attributes.push(jsxAttribute)
  } else {
    node.expression.openingElement.attributes = [jsxAttribute]
  }
}

const addComponentPlugin = (
  _: any,
  options: {
    parentId: string
    type: string
  },
) => {
  const { parentId, type } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId === parentId) {
          // Change the JSX element in the string to node template
          const node = template.ast(components[type], {
            plugins: ['jsx'],
          })

          // Add the component-id in the attribute
          addComponentIdAttribute(node)

          // Add to the children of the parent component
          if (path.node.children) {
            path.node.children.push(node)
          } else {
            path.node.children = [node]
          }
        }
      },
    },
  }
}

export default addComponentPlugin
