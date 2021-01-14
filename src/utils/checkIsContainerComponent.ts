const checkIsContainerComponent = (
  componentId: string,
  props: IProps,
): boolean => {
  const componentPropIds = props.byComponentId[componentId]

  const childrenProp = componentPropIds?.find(
    propId => props.byId[propId].name === 'children',
  )

  // If the component(root custom component) has the children prop, then it is assumed to be container component
  return childrenProp !== undefined
}

export default checkIsContainerComponent
