import { generateComponentId } from '../utils/generateId'
import {
  toJsxAttribute,
  getComponentId,
  getAttribute,
} from './utils/babel-plugin-utils'

const setComponentIdPlugin = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)

        if (visitedComponentId) return

        const componentId = generateComponentId()
        const idAttribute = getAttribute('id', path.node)

        // Convert to jsx attribute with compId as name.
        const jsxAttribute = toJsxAttribute(
          'compId',
          idAttribute && idAttribute.value.value === 'root'
            ? 'root'
            : componentId,
        )
        path.node.attributes.push(jsxAttribute)
      },
    },
  }
}

export default setComponentIdPlugin
