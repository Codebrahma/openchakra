import { getComponentId } from './utils/babel-plugin-utils'

const deleteComponentPlugin = (
  _: any,
  options: {
    componentId: string
  },
) => {
  const { componentId } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentId = getComponentId(path.node)
        if (visitedComponentId && visitedComponentId === componentId) {
          path.parentPath.remove()
        } else return
      },
    },
  }
}

export default deleteComponentPlugin
