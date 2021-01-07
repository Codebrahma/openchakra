const getPropsThatUseCustomProp = (
  customPropName: string,
  customComponentType: string,
  customComponents: IComponents,
  props: IProps,
) => {
  const propsUsingCustomProp: IProps = {
    byId: {},
    byComponentId: {},
  }
  const getPropsUsingCustomPropRecursively = (componentId: string) => {
    props.byComponentId[componentId].forEach(propId => {
      const prop = props.byId[propId]
      if (
        prop.derivedFromPropName === customPropName &&
        prop.derivedFromComponentType === customComponentType
      ) {
        if (propsUsingCustomProp.byComponentId[componentId] === undefined)
          propsUsingCustomProp.byComponentId[componentId] = [propId]
        else {
          propsUsingCustomProp.byComponentId[componentId].push(propId)
        }
        propsUsingCustomProp.byId[propId] = { ...prop }
      }
    })
    customComponents[componentId].children.forEach(childId =>
      getPropsUsingCustomPropRecursively(childId),
    )
  }
  getPropsUsingCustomPropRecursively(
    customComponents[customComponentType].children[0],
  )
  return propsUsingCustomProp
}

export default getPropsThatUseCustomProp
