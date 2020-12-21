import { getComponentId } from './utils/babel-plugin-utils'

const deletePropPlugin = (
  _: any,
  options: {
    componentId: string
    propName: string
  },
) => {
  const { componentId, propName } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)
        if (visitedComponentId && visitedComponentId === componentId) {
          const propIndex = path.node.attributes.findIndex(
            (node: any) => node.name.name === propName,
          )
          path.node.attributes.splice(propIndex, 1)
        } else return
      },
    },
  }
}

export default deletePropPlugin
