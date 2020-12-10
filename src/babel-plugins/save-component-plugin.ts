import { getComponentId, getNode } from './utils/babel-plugin-utils'
// import * as t from '@babel/types'
import { generateComponentId } from '../utils/generateId'

const saveComponentPlugin = (
  _: any,
  options: {
    componentId: string
    customComponentName: string
  },
) => {
  const { componentId, customComponentName } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const element = path.node
        const visitedComponentId = getComponentId(element.openingElement)

        if (visitedComponentId === componentId) {
          // Get the root parent path. Thus we can find the element to move
          const component = path.toString()
          const newComponentId = generateComponentId()

          const customCompInstance = `<${customComponentName} compId="${newComponentId}"/>`
          const customCompInstanceNode = getNode(customCompInstance)

          const functionalComponent = `const ${customComponentName}=()=>{return (${component})}`
          const functionalComponentNode = getNode(functionalComponent)

          const programPath = path
            .getAncestry()
            .find((path: any) => path.type === 'Program')

          // New custom component function will be added after the import statement
          let index = 0
          programPath.node.body.forEach((path: any) => {
            if (path.type === 'ImportDeclaration') index = index + 1
            else return
          })
          programPath.node.body.splice(index, 0, functionalComponentNode)

          // The component that is made as custom component is replaced with the custom component instance
          path.insertAfter(customCompInstanceNode.expression)
          path.remove()

          // As The element is found, so we can stop all other traversing
          path.stop()
        }
      },
    },
  }
}

export default saveComponentPlugin
