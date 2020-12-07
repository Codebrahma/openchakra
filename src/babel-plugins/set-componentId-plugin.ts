import { generateComponentId } from '../utils/generateId'
import { toJsxAttribute, getComponentId } from './utils/babel-plugin-utils'

const setComponentIdPlugin = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)
        if (visitedComponentId) return

        const componentId = generateComponentId()

        // Convert to jsx attribute with compId as name.
        const jsxAttribute = toJsxAttribute('compId', componentId)
        path.node.attributes.push(jsxAttribute)
      },
    },
  }
}

export default setComponentIdPlugin
