import { declare } from '@babel/helper-plugin-utils'
import { functionOnEnter, functionOnExit } from './functionDeclaration'
import addProps, { identifierPropHandler } from './addProps'
import { generatePropId } from '../../utils/generateId'
import {
  getComponentId,
  getParentComponentId,
} from '../utils/babel-plugin-utils'

class getComponentsPlugin {
  state: {
    components: IComponents
    props: IProps
    customComponents: IComponents
    customComponentsProps: IProps
  }
  plugin: any
  constructor() {
    // The state of the babel.
    this.state = {
      components: {},
      props: {
        byId: {},
        byComponentId: {
          root: [],
        },
      },
      customComponents: {},
      customComponentsProps: {
        byId: {},
        byComponentId: {
          root: [],
        },
      },
    }

    // Used to differentiate between App component and other custom components
    let functionName = ''

    this.plugin = declare((api: any) => {
      // Used to check the types
      const { types: t } = api

      return {
        visitor: {
          // This type includes functions like
          // const App=()=>{} && const App=function(){}
          VariableDeclaration: {
            enter: (path: any) => {
              const variableDeclaratorType = path.node.declarations[0].init.type

              if (
                variableDeclaratorType === 'ArrowFunctionExpression' ||
                variableDeclaratorType === 'FunctionExpression'
              ) {
                const newFunctionName = path.node.declarations[0].id.name

                const { customComponents, customComponentsProps } = this.state
                const isJsxReturned = functionOnEnter({
                  node: path.node.declarations[0].init,
                  functionName: newFunctionName,
                  customComponents,
                  customComponentsProps,
                })
                // Only update the function name if the function returns jsx.
                if (isJsxReturned) functionName = newFunctionName
              }
            },
            exit: (path: any) => {
              const variableDeclaratorType = path.node.declarations[0].init.type

              const { customComponents } = this.state
              if (
                variableDeclaratorType === 'ArrowFunctionExpression' ||
                variableDeclaratorType === 'FunctionExpression'
              ) {
                functionOnExit({
                  node: path.node.declarations[0].init,
                  functionName: path.node.declarations[0].id.name,
                  customComponents,
                })
              }
            },
          },
          // This type includes functions like
          // function App(){ }
          FunctionDeclaration: {
            enter: (path: any) => {
              const { customComponents, customComponentsProps } = this.state
              const newFunctionName = path.node.id.name

              const isJsxReturned = functionOnEnter({
                node: path.node,
                functionName: newFunctionName,
                customComponents,
                customComponentsProps,
              })
              // Only update the function name if the function returns jsx.
              if (isJsxReturned) functionName = newFunctionName
            },
            // Children is set at the exit because when entering the fucntional, we had not set id to the nodes.
            // That is the reason why we set the children property at the exit.
            exit: (path: any) => {
              const { customComponents } = this.state

              functionOnExit({
                node: path.node,
                functionName: path.node.id.name,
                customComponents,
              })
            },
          },
          JSXElement: (path: any) => {
            const openingElement = path.node.openingElement
            const componentId = getComponentId(openingElement)
            const isCustomComponent = functionName !== 'App'
            const parentId = getParentComponentId(path)

            if (openingElement.name.name === 'ChakraProvider') return

            const components = isCustomComponent
              ? this.state.customComponents
              : this.state.components
            const props = isCustomComponent
              ? this.state.customComponentsProps
              : this.state.props

            // Store the component-id in each node
            path.node.id = componentId
            components[componentId] = {
              id: componentId,
              type: openingElement.name.name,
              children: [],
              parent: isCustomComponent ? functionName : 'root',
            }

            if (parentId && components[parentId]) {
              components[parentId].children.push(componentId)
              components[componentId].parent = parentId
            }

            props.byComponentId[componentId] = []

            // Add the props.
            addProps({
              path,
              props,
              openingElement,
              componentId,
              functionName,
            })

            // Box also has the children as text which includes empty spaces.
            // To differentiate between Box and other components like Text, Button, Badge etc..
            // The string is trimmed and spaces are removed and then the length of the string is checked.

            // Needs to be Handled in better way.
            if (openingElement.name.name !== 'Box') {
              path.node.children
                .filter(
                  (child: any) =>
                    t.isJSXText(child) || t.isJSXExpressionContainer(child),
                )
                .forEach((child: any) => {
                  const propId = generatePropId()
                  if (t.isJSXText(child)) {
                    const trimmedChildValue = child.value.trim()
                    // The value is trimmed because by default every component will have child component with white spaces
                    // When the child component of box component is in next line, it will add whitespaces automatically.
                    // Thus removing white spaces makes us to differentiate between automatically added children and manually added children.
                    if (trimmedChildValue.length > 0) {
                      props.byComponentId[componentId].push(propId)
                      props.byId[propId] = {
                        id: propId,
                        name: 'children',
                        value: trimmedChildValue,
                        derivedFromPropName: null,
                        derivedFromComponentType: null,
                      }
                    }
                  } else {
                    props.byComponentId[componentId].push(propId)
                    props.byId[propId] = {
                      id: propId,
                      name: 'children',
                      value: '',
                      derivedFromPropName: null,
                      derivedFromComponentType: null,
                    }
                    identifierPropHandler({
                      identifierName: child.expression.name,
                      path,
                      propId,
                      props,
                      functionName,
                    })
                  }
                })
            }
          },
        },
      }
    })
  }
}

export default getComponentsPlugin
