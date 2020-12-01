import * as t from '@babel/types'

import { generateComponentId } from '../utils/generateId'

const setComponentIdPlugin = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const componentId = generateComponentId()

        // Convert to jsx attribute with compId as name.
        const jsxAttribute = t.jsxAttribute(
          t.jsxIdentifier('compId'), //prop-name
          t.stringLiteral(componentId), //prop-value
        )
        path.node.attributes.push(jsxAttribute)
      },
    },
  }
}

export default setComponentIdPlugin
