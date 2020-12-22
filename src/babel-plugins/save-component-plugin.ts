import { declare } from '@babel/helper-plugin-utils'
import { getComponentId, getNode } from './utils/babel-plugin-utils'
// import * as t from '@babel/types'
import { generateComponentId } from '../utils/generateId'
class saveComponentPlugin {
  functionalComponentCode: string
  plugin: any
  constructor(options: { componentId: string; customComponentName: string }) {
    const { componentId, customComponentName } = options
    this.functionalComponentCode = ``

    this.plugin = declare(() => {
      return {
        visitor: {
          JSXElement: (path: any) => {
            const element = path.node
            const visitedComponentId = getComponentId(element.openingElement)

            if (visitedComponentId === componentId) {
              // Get the root parent path. Thus we can find the element to move
              const component = path.toString()
              const newComponentId = generateComponentId()

              const customCompInstance = `<${customComponentName} compId="${newComponentId}"/>`
              const customCompInstanceNode = getNode(customCompInstance)

              this.functionalComponentCode = `import React from 'react'\n;
               const ${customComponentName}=()=>{return (${component})}\n export default ${customComponentName} `

              // The component that is made as custom component is replaced with the custom component instance
              path.insertAfter(customCompInstanceNode.expression)
              path.remove()

              // As The element is found, so we can stop all other traversing
              path.stop()
            }
          },
        },
      }
    })
  }
}

export default saveComponentPlugin
