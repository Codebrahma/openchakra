import { declare } from '@babel/helper-plugin-utils'
import componentsStructure from '../utils/componentsStructure/componentsStructure'

export type IComponentsUsed = {
  chakraComponents: string[]
  customComponents: string[]
}

class getUsedComponents {
  componentsUsed: IComponentsUsed
  plugin: any
  constructor() {
    this.componentsUsed = {
      chakraComponents: [],
      customComponents: [],
    }

    this.plugin = declare(() => {
      return {
        visitor: {
          JSXOpeningElement: (path: any) => {
            const componentName: string = path.node.name.name

            if (componentsStructure[componentName]) {
              this.componentsUsed.chakraComponents.push(componentName)
            } else {
              this.componentsUsed.customComponents.push(componentName)
            }
          },
        },
      }
    })
  }
}

export default getUsedComponents
