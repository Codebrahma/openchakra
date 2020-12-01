const removeComponentIdPlugin = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const filteredAttributes = path.node.attributes.filter(
          (node: any) => node.name && node.name.name !== 'compId',
        )
        path.node.attributes = filteredAttributes
      },
    },
  }
}

export default removeComponentIdPlugin
