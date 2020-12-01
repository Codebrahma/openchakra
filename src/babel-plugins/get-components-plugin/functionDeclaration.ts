export const getReturnNode = (body: any) => {
  // This is for function App(){}
  if (body) {
    if (body.body)
      return body.body.find((node: any) => node.type === 'ReturnStatement')
    // This is for const App=()=>{} && const App=function(){}
    else {
      return body.find((node: any) => node.type === 'ReturnStatement')
    }
  }
}

const getOuterMostChildOfReturn = (node: any) => {
  // If the function does not have block statement.
  if (node.body.type !== 'BlockStatement') {
    return node.body.id
  } else {
    const returnStatementNode = getReturnNode(node.body)
    return returnStatementNode.argument.id
  }
}

type IFunctionOnEnter = {
  node: any
  functionName: string
  customComponents: IComponents
  customComponentsProps: IProps
}

export const functionOnEnter = (payload: IFunctionOnEnter) => {
  const {
    node,
    functionName,
    customComponentsProps,
    customComponents,
  } = payload
  // Only store components from the fucntion if the function returns the JSX element
  let isJsxReturned = false
  // If the function does not have block statement, but returns jsx or any variable.
  // For Example: const App=()=><Text>Hello world</Text>
  if (node.body.type !== 'BlockStatement') {
    return node.body.type === 'JSXElement'
  } else {
    /* Example: const App=()=>{
      return <Text>Hello world</Text>
     }*/
    const returnStatementNode = getReturnNode(node.body)

    isJsxReturned = returnStatementNode
      ? returnStatementNode.argument.type === 'JSXElement'
      : false
  }

  if (isJsxReturned && functionName !== 'App') {
    customComponents[functionName] = {
      id: functionName,
      type: functionName,
      children: [],
      parent: '',
    }

    customComponentsProps.byComponentId[functionName] = []
  }
  return isJsxReturned
}

export const functionOnExit = (payload: {
  node: any
  functionName: string
  customComponents: IComponents
}) => {
  const { node, functionName, customComponents } = payload
  if (functionName !== 'App' && customComponents[functionName])
    customComponents[functionName].children.push(
      getOuterMostChildOfReturn(node),
    )
}
