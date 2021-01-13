import * as t from '@babel/types'

const convertInstancesToContainerComponent = (
  _: any,
  options: {
    componentName: string
  },
) => {
  const { componentName } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentName = openingElement.name.name

        if (visitedComponentName === componentName) {
          path.node.closingElement = t.jsxClosingElement(
            t.jsxIdentifier(componentName),
          )
          path.node.openingElement.selfClosing = false
        } else return
      },
    },
  }
}

export default convertInstancesToContainerComponent
