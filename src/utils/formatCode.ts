const formatCode = async (code: string) => {
  let formattedCode = `// 🚨 Your props contains invalid code`

  const prettier = await import('prettier/standalone')
  const babelParser = await import('prettier/parser-babel')

  try {
    formattedCode = prettier.format(code, {
      parser: 'babel',
      plugins: [babelParser],
      semi: false,
      singleQuote: true,
    })
  } catch (e) {
    formattedCode = code
  }

  return formattedCode
}

export default formatCode
