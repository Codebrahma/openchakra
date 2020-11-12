/**
 * @method
 * @name generateComponentId
 * @description This function will generate id for the components.
 * @return string
 */
export const generateComponentId = (): string => {
  return `comp-${(
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  ).toUpperCase()}`
}

/**
 * @method
 * @name generatePropId
 * @description This function will generate id for the props.
 * @return string
 */
export const generatePropId = (): string => {
  return `prop-${(
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  ).toUpperCase()}`
}
