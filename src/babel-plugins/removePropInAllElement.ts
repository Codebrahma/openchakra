const removePropInAllElements = (_: any, options: { propName: string }) => {
  const { propName } = options
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const filteredAttributes = path.node.attributes.filter(
          (attribute: any) => attribute.name.name !== propName,
        )
        path.node.attributes = filteredAttributes
      },
    },
  }
}

export default removePropInAllElements
