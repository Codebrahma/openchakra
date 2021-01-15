import * as t from '@babel/types'
import template from '@babel/template'

export const getComponentId = (node: any) => {
  const attribute = node.attributes?.find(
    (attr: any) => attr && attr.name && attr.name.name === 'compId',
  )
  return attribute?.value.value
}

export const getParentComponentId = (path: any) => {
  const parentPath = path.parentPath
  if (parentPath.node.type === 'JSXElement') {
    const openingElement = parentPath.node.openingElement
    return getComponentId(openingElement)
  } else return 'root'
}

// Convert to jsx attribute using attr name and attr value
export const toJsxAttribute = (
  attributeName: string,
  attributeValue: string | number,
) => {
  return t.jsxAttribute(
    t.jsxIdentifier(attributeName),
    typeof attributeValue === 'string'
      ? t.stringLiteral(attributeValue)
      : t.jsxExpressionContainer(t.numericLiteral(attributeValue)),
  )
}

export const addAttribute = (attribute: any, node: any) =>
  node.attributes.push(attribute)

export const getAttribute = (attributeName: string, node: any) =>
  node.attributes?.find((attr: any) => attr.name.name === attributeName)

export const toJsxText = (textValue: string) => {
  return t.jsxText(textValue)
}

export const getJSXElement = (jsxString: string) => {
  const ast = template.ast(jsxString, {
    plugins: ['jsx'],
  })
  return ast.expression
}
