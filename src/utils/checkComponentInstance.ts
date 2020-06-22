const checkComponentInstance = (pages: IPages, type: string) => {
  let instanceFound = false
  Object.values(pages).forEach(components => {
    Object.values(components).forEach(component => {
      if (component.type === type) {
        instanceFound = true
        return
      }
    })
    if (instanceFound) return
  })
  return instanceFound
}

export default checkComponentInstance
