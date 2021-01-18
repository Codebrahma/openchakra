const convertObjectToString = (obj: any, key: string = 'theme') => {
  let str = ''
  for (const p in obj) {
    if (typeof obj[p] === 'object')
      str += p + `:{` + convertObjectToString(obj[p], `${key}.${p}`) + '},\n'
    else str += p + ': "' + obj[p] + '",\n'
  }
  return str
}

export default convertObjectToString
