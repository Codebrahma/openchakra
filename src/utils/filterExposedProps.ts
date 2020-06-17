const filterExposedProps = (
  exposedProps: PropRefs | undefined,
  customParentProps: any,
) => {
  let filteredProp = {}
  if (customParentProps && exposedProps) {
    Object.values(exposedProps).forEach(prop => {
      if (customParentProps[prop.customPropName])
        filteredProp = {
          ...filteredProp,
          [prop.targetedProp]: customParentProps[prop.customPropName],
        }
    })
  }
  return filteredProp
}

export default filterExposedProps
