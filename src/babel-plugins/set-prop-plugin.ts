const setPropPlugin = (payload: {
  componentId: string
  propName: string
  propValue: string
}) => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        console.log(path)
      },
    },
  }
}

export default setPropPlugin
