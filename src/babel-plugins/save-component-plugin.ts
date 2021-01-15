import { declare } from '@babel/helper-plugin-utils'

import { getComponentId, getJSXElement } from './utils/babel-plugin-utils'

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

              // Create the function component.
              this.functionalComponentCode = `import React from 'react'\n;
                       const ${customComponentName}= ${
                exposedProps.length > 0 ? '(props)' : '()'
              }=>
                      {
                         return (${component})
                        }\n
                         export default ${customComponentName} `

              // Obtain the props for the component instance.
              const customProps = exposedProps.map(
                prop => `${prop.derivedFromPropName}="${prop.value}"`,
              )

              const customCompInstance = `<${customComponentName} compId="${componentInstanceId}" ${customProps.join(
                ' ',
              )}/>`
              const customCompInstanceNode = getJSXElement(customCompInstance)

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
