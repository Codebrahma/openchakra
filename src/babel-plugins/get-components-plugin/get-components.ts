import { declare } from '@babel/helper-plugin-utils'
import * as t from '@babel/types'
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
    }

    // Used to differentiate between App component and other custom components
    let functionName = ''

    this.plugin = declare(() => {
      // Used to check the types

      return {
        visitor: {
          ArrowFunctionExpression: (path: any) => {
            const parentPath = path.parentPath
            // Finding the function name
            // And updating the components based on the function name.
            functionName = parentPath.node.id.name
            if (functionName === 'App') {
              this.state.components['root'] = {
                id: 'root',
                type: 'Box',
                parent: '',
                children: [],
              }
              this.state.props.byComponentId['root'] = []
            } else {
              this.state.components[functionName] = {
                id: functionName,
                type: functionName,
                parent: '',
                children: [],
              }
              this.state.props.byComponentId[functionName] = []

              // Find the params defined for the custom components
              const params = path.node.params
              if (params.length > 0 && t.isObjectPattern(params[0])) {
                const properties = params[0].properties
                properties.forEach((property: any) => {
                  const name = property.key.name
                  const value = property.value ? property.value.name : ''
                  const newPropId = generatePropId()
                  this.state.props.byComponentId[functionName].push(newPropId)
                  this.state.props.byId[newPropId] = {
                    id: newPropId,
                    name,
                    value,
                    derivedFromPropName: null,
                    derivedFromComponentType: null,
                  }
                })
              }
            }
          },

          JSXElement: (path: any) => {
            const openingElement = path.node.openingElement
            const componentId = getComponentId(openingElement)
            const isCustomComponent = functionName !== 'App'
            const parentId = getParentComponentId(path)

            if (openingElement.name.name === 'ChakraProvider') return

            const components = this.state.components
            const props = this.state.props

            // Store the component-id in each node
            path.node.id = componentId
            components[componentId] = {
              id: componentId,
              type: openingElement.name.name,
              children: [],
              parent: isCustomComponent ? functionName : 'root',
            }

            if (parentId) {
              // This is to set the root element of the custom component
              if (parentId === 'root' && isCustomComponent) {
                components[functionName].children.push(componentId)
              }
              // This is for setting children and parent for all the components
              if (components[parentId]) {
                components[parentId].children.push(componentId)
                components[componentId].parent = parentId
              }
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
          },
        },
      }
    })
  }
}

export default getComponentsPlugin
