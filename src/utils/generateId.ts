export const generateComponentId = () => {
  return `comp-${(
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  ).toUpperCase()}`
}

export const generatePropId = () => {
  return `prop-${(
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  ).toUpperCase()}`
}
