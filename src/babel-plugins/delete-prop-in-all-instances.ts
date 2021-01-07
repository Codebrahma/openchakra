const deletePropInAllInstancesPlugin = (
  _: any,
  options: {
    componentName: string
    propName: string
  },
) => {
  const { componentName, propName } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const visitedComponentName = path.node.name.name

        if (visitedComponentName === componentName) {
          const propIndex = path.node.attributes.findIndex(
            (node: any) => node.name.name === propName,
          )
          path.node.attributes.splice(propIndex, 1)
        } else return
      },
    },
  }
}

export default deletePropInAllInstancesPlugin
