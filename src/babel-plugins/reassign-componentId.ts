const reassignComponentId = (_: any, options: { componentIds: string[] }) => {
  const { componentIds } = options
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const componentId = componentIds.shift() || ''
        const compIdPropIndex = path.node.attributes.findIndex(
          (node: any) => node.name.name === 'compId',
        )

        path.node.attributes[compIdPropIndex].value.value = componentId
      },
    },
  }
}

export default reassignComponentId
