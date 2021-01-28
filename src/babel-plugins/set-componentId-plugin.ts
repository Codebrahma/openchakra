import { generateComponentId } from '../utils/generateId'
import { toJsxAttribute, getComponentId } from './utils/babel-plugin-utils'

const checkIsRootComponent = (node: any) => {
  const attribute = node.attributes?.find(
    (attr: any) => attr && attr.name && attr.name.name === 'id',
  )
  if (attribute === undefined) return false

  if (attribute.value.value === 'root') return true
  else return false
}

const setComponentIdPlugin = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId) return

        if (checkIsRootComponent(path.node)) {
          const jsxAttribute = toJsxAttribute('compId', 'root')
          path.node.attributes.push(jsxAttribute)
        } else {
          const componentId = generateComponentId()
          // Convert to jsx attribute with compId as name.
          const jsxAttribute = toJsxAttribute('compId', componentId)
          path.node.attributes.push(jsxAttribute)
        }
      },
    },
  }
}

export default setComponentIdPlugin
