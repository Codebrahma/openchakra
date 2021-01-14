import traverse from '@babel/traverse'

const deleteCustomChildrenProp = (_: any) => {
  return {
    visitor: {
      ArrowFunctionExpression(path: any) {
        const componentName = path.parentPath.node.id.name

        // Only remove the params for the component, if it is a custom component.
        if (componentName === 'App') return

        let isPropsUsed = false

        // Traverse and check whether any other component uses the props.
        traverse(
          path.parentPath.node,
          {
            MemberExpression(path: any) {
              if (
                path.node.object.name === 'props' &&
                path.node.property.name !== 'children'
              )
                isPropsUsed = true
            },
          },
          path.parentPath.scope,
          path.parentPath.state,
          path.parentPath,
        )

        if (!isPropsUsed) path.node.params = []
      },
      JSXExpressionContainer(path: any) {
        const expression: any = path.node.expression
        if (expression.type === 'MemberExpression') {
          if (
            expression.object.name === 'props' &&
            expression.property.name === 'children'
          )
            path.remove()
        }
      },
    },
  }
}

export default deleteCustomChildrenProp
