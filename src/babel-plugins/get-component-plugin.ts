import { declare } from '@babel/helper-plugin-utils'
import { getComponentId } from './utils/babel-plugin-utils'

class getComponent {
  component: string
  plugin: any
  constructor(options: { componentId: string }) {
    const { componentId } = options
    this.component = ''
    this.plugin = declare(() => {
      return {
        visitor: {
          JSXElement: (path: any) => {
            const openingElement = path.node.openingElement
            const visitedComponentId = getComponentId(openingElement)
            if (visitedComponentId !== componentId) return

            this.component = path.toString()
          },
        },
      }
    })
  }
}

export default getComponent
