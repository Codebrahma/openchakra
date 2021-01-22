import { declare } from '@babel/helper-plugin-utils'

class getUsedComponents {
  componentsUsed: string[]
  plugin: any
  constructor() {
    this.componentsUsed = []

    this.plugin = declare(() => {
      return {
        visitor: {
          JSXOpeningElement: (path: any) => {
            this.componentsUsed.push(path.node.name.name)
          },
        },
      }
    })
  }
}

export default getUsedComponents
