import template from '@babel/template'

const addComponentImportsPlugin = (
  _: any,
  options: {
    components: string[]
  },
) => {
  const { components } = options

  return {
    visitor: {
      ImportDeclaration(path: any) {
        if (path.node.source.value !== '@chakra-ui/core') return
        if (components.length === 0) return
        const imports = components.join(', ')
        const importAst = template.ast(
          `import {ChakraProvider, theme , ${imports}} from "@chakra-ui/core"`,
        )
        path.replaceWith(importAst)
        path.skip()
      },
    },
  }
}

export default addComponentImportsPlugin
