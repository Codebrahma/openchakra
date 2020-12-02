const deleteComponentPlugin = (
  _: any,
  options: {
    componentId: string
  },
) => {
  const { componentId } = options

  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const idAttribute = path.node.attributes.find(
          (node: any) => node.name.name === 'compId',
        )
        if (idAttribute && idAttribute.value.value === componentId) {
          path.parentPath.remove()
        } else return
      },
    },
  }
}

export default deleteComponentPlugin
