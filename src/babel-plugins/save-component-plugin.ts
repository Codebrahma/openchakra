import { declare } from '@babel/helper-plugin-utils'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

import { getComponentId, getNode } from './utils/babel-plugin-utils'
import { generateComponentId } from '../utils/generateId'

class saveComponentPlugin {
  functionalComponentCode: string
  plugin: any
  constructor(options: {
    componentId: string
    customComponentName: string
    exposedProps: IProp[]
  }) {
    const { componentId, customComponentName, exposedProps } = options
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

              const functionParams: string[] = []

              const addToParams = (propName: string) => {
                const defaultPropValue = exposedProps.find(
                  prop => prop.derivedFromPropName === propName,
                )?.value
                functionParams.push(`${propName} = '${defaultPropValue}'`)
              }

              // Traverse through the element and add the params required for the component.
              traverse(
                element,
                {
                  JSXElement(path: any) {
                    const children = path.node.children
                    if (t.isJSXExpressionContainer(children[0])) {
                      const customPropName =
                        path.node.children[0].expression.name
                      addToParams(customPropName)
                    }
                  },
                  JSXAttribute(path: any) {
                    if (t.isJSXExpressionContainer(path.node.value)) {
                      const customPropName = path.node.value.expression.name
                      addToParams(customPropName)
                    }
                  },
                },
                path.scope,
                path.state,
                path,
              )

              // Create the function component.
              this.functionalComponentCode = `import React from 'react'\n;
               const ${customComponentName}=({${functionParams.join(',')}})=>
               {
                 return (${component})
                }\n
                 export default ${customComponentName} `

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
