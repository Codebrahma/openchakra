//This function is used to take props and its values that are exposed from the exposedProps property.
const filterExposedProps = (
  exposedProps: PropRefs | undefined,
  customParentProps: any,
) => {
  let filteredProp = {}
  if (customParentProps && exposedProps) {
    Object.values(exposedProps).forEach(prop => {
      filteredProp = {
        ...filteredProp,
        [prop.targetedProp]: customParentProps[prop.customPropName],
      }
    })
  }
  return filteredProp
}

export default filterExposedProps
