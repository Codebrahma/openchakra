import { declare } from '@babel/helper-plugin-utils'
import traverse from '@babel/traverse'

import { getComponentId, getJSXElement } from './utils/babel-plugin-utils'
import componentsStructure from '../utils/componentsStructure/componentsStructure'

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

    const generateCustomCompImports = (customComponentsList: string[]) => {
      return customComponentsList.map(
        componentName =>
          `import ${componentName} from './components/${componentName}.js'`,
      )
    }

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

              // Obtain the component-names used in the component.
              const chakraComponentsUsed: string[] = []
              const customComponentsUsed: string[] = []

              // Traverse the node and find the component-names used in the component.
              traverse(
                path.node,
                {
                  JSXOpeningElement(path: any) {
                    const componentName = path.node.name.name
                    if (componentsStructure[componentName])
                      chakraComponentsUsed.push(componentName)
                    else customComponentsUsed.push(componentName)
                  },
                },
                path.scope,
                path,
              )

              // Create the function component.
              this.functionalComponentCode = `
              import React from 'react'\n;
              import {${chakraComponentsUsed.join(',')}} from '@chakra-ui/core'
              ${generateCustomCompImports(customComponentsUsed)}

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
              path.insertAfter(customCompInstanceNode)
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
