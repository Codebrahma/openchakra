// This function will replace the specified index in the string with the replacement character
const replaceAt = (
  string: string,
  replaceIndex: number,
  replacementString: string,
): string => {
  return (
    string.substr(0, replaceIndex) +
    replacementString +
    string.substr(replaceIndex + replacementString.length)
  )
}

const findShortPropName = (propName: string): string => {
  switch (propName) {
    case 'margin':
      return 'm'
    case 'padding':
      return 'p'
    case 'marginLeft':
      return 'ml'
    case 'marginRight':
      return 'mr'
    case 'marginTop':
      return 'mt'
    case 'marginBottom':
      return 'mb'
    case 'paddingLeft':
      return 'pl'
    case 'paddingRight':
      return 'pr'
    case 'paddingTop':
      return 'pt'
    case 'paddingBottom':
      return 'pb'
    default:
      return propName
  }
}

// This function will look whether the prop-name has dash character or not.
// If it does not have any dash, it returns the prop name without any modification
// It it finds any, the dash is removed and the character next to the dash will be converted to uppercase.
const convertToProperPropName = (propName: string): string => {
  if (propName.indexOf('-') !== -1) {
    const charNextToLineIndex = propName.indexOf('-') + 1
    const modifiedPropName = replaceAt(
      propName,
      charNextToLineIndex,
      propName[charNextToLineIndex].toUpperCase(),
    ).replace('-', '')

    return findShortPropName(modifiedPropName)
  }

  return findShortPropName(propName)
}

export default convertToProperPropName
