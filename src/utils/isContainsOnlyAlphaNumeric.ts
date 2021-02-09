const isContainsOnlyAlphaNumeric = (name: string) => {
  const pattern = /^[a-z0-9]+$/i

  return pattern.test(name)
}

export default isContainsOnlyAlphaNumeric
