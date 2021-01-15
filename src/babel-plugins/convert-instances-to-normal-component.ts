// This will convert the container components instances to normal components.
// For example : <Card></Card>  will be converted to <Card />
const convertInstancesToNormalComponent = (
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
          path.node.closingElement = null
          path.node.openingElement.selfClosing = true
        } else return
      },
    },
  }
}

export default convertInstancesToNormalComponent
