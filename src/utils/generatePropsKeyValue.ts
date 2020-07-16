const generatePropsKeyValue = (componentProps: IProp[], customProps: any) => {
  const propsObject: any = {}
  componentProps.forEach(compProp => {
    if (compProp.derivedFromComponentType && compProp.derivedFromPropName)
      propsObject[compProp.name] = customProps[compProp.derivedFromPropName]
    else propsObject[compProp.name] = compProp.value
  })
  return propsObject
}
export default generatePropsKeyValue
