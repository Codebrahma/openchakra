//This function is used to find the value of the props that are exposed .
// the value is found from the props from the  root parent custom component.
const findExposedPropsValue = (
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

export default findExposedPropsValue
