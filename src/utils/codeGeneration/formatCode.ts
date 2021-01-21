import prettier from 'prettier-standalone'

const formatCode = (code: string) => {
  let formattedCode = prettier.format(code)

  return formattedCode
}

export default formatCode
