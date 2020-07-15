const generatePropsKeyValue = (componentProps: IProp[], props: any) => {
  const propsObject: any = {}

  componentProps.forEach(compProp => {
    if (compProp.derivedFromComponentType && compProp.derivedFromPropName)
      propsObject[compProp.name] = props[compProp.derivedFromPropName]
    else propsObject[compProp.name] = compProp.value
  })
  return propsObject
}
export default generatePropsKeyValue
