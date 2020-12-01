export const getComponentId = (node: any) => {
  const attribute = node.attributes.find(
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
