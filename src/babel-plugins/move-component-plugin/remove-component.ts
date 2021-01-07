import { getComponentId } from '../utils/babel-plugin-utils'
import { declare } from '@babel/helper-plugin-utils'

class removeComponentPlugin {
  removedComponent: string = ``
  plugin: any

  constructor(options: { componentId: string }) {
    const { componentId } = options

    this.plugin = declare(() => {
      return {
        visitor: {
          JSXElement: (path: any) => {
            const element = path.node
            const visitedComponentId = getComponentId(element.openingElement)
            if (visitedComponentId === componentId) {
              // Remove the element from its original position
              this.removedComponent = path.toString()
              path.remove()
              path.stop()
            }
          },
        },
      }
    })
  }
}

export default removeComponentPlugin
