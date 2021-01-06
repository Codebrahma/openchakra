// Gets the exposed props inside the component.
export const getExposedProps = (
  componentId: string,
  components: IComponents,
  props: IProps,
): IProp[] => {
  const exposedProps: IProp[] = []

  const getExposedPropsRecursively = (component: IComponent) => {
    const componentProps: IProp[] = []

    // Fetch the props for the component
    props.byComponentId[component.id].forEach(propId =>
      componentProps.push(props.byId[propId]),
    )
    // Find the exposed props in the props of the component.
    componentProps.forEach(prop => {
      if (prop.derivedFromPropName) exposedProps.push(prop)
    })
    component.children.forEach(childId => {
      getExposedPropsRecursively(components[childId])
    })
  }

  getExposedPropsRecursively(components[componentId])

  return exposedProps
}
