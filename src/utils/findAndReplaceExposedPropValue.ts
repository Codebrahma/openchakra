// This will look for the exposed prop and replace the value with the value in the custom props
const findAndReplaceExposedPropValue = (
  componentProps: IProp[],
  customProps?: any,
) => {
  const propsObject: any = {}
  componentProps &&
    componentProps.forEach(compProp => {
      if (
        customProps &&
        compProp.derivedFromComponentType &&
        compProp.derivedFromPropName
      )
        propsObject[compProp.name] = customProps[compProp.derivedFromPropName]
      else propsObject[compProp.name] = compProp.value
    })
  return propsObject
}
export default findAndReplaceExposedPropValue
