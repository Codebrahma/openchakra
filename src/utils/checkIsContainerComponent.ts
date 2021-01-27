const checkIsContainerComponent = (
  componentId: string,
  props: IProps,
): boolean => {
  const componentPropIds = props.byComponentId[componentId]

  const isContainerCompProp = componentPropIds?.find(
    propId => props.byId[propId].name === 'isContainerComponent',
  )

  // If the component(root custom component) has the isContainerComponent prop, then it is assumed to be container component
  return isContainerCompProp !== undefined
}

export default checkIsContainerComponent
