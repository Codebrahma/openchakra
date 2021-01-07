import { declare } from '@babel/helper-plugin-utils'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

import { getComponentId, getNode } from './utils/babel-plugin-utils'

class saveComponentPlugin {
  functionalComponentCode: string
  plugin: any
  constructor(options: {
    componentId: string
    customComponentName: string
    exposedProps: IProp[]
    componentInstanceId: string
  }) {
    const {
      componentId,
      customComponentName,
      exposedProps,
      componentInstanceId,
    } = options

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

              const functionParams: string[] = []

              // Traverse through the element and add the params required for the component.
              traverse(
                element,
                {
                  JSXElement(path: any) {
                    const children = path.node.children
                    if (t.isJSXExpressionContainer(children[0])) {
                      const customPropName =
                        path.node.children[0].expression.name

                      functionParams.push(customPropName)
                    }
                  },
                  JSXAttribute(path: any) {
                    if (t.isJSXExpressionContainer(path.node.value)) {
                      const customPropName = path.node.value.expression.name

                      functionParams.push(customPropName)
                    }
                  },
                },
                path.scope,
                path.state,
                path,
              )

              const functionComponentParams: string =
                functionParams.length > 0 ? `{${functionParams.join(',')}}` : ''

              // Create the function component.
              this.functionalComponentCode = `import React from 'react'\n;
                       const ${customComponentName}=(${functionComponentParams})=>
                       {
                         return (${component})
                        }\n
                         export default ${customComponentName} `

              // Obtain the props for the component instance.
              const props = functionParams.map(param => {
                const propValue =
                  exposedProps.find(prop => prop.derivedFromPropName === param)
                    ?.value || ''
                return `${param}="${propValue}"`
              })

              const customCompInstance = `<${customComponentName} compId="${componentInstanceId}" ${props.join(
                ' ',
              )}/>`
              const customCompInstanceNode = getNode(customCompInstance)

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
