const removeImportsPlugin = () => {
  return {
    visitor: {
      ImportDeclaration(path: any) {
        path.remove()
      },
    },
  }
}

export default removeImportsPlugin
