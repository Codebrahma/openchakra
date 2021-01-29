import { declare } from '@babel/helper-plugin-utils'
import * as t from '@babel/types'
import addProps from './addProps'
import { generatePropId } from '../../utils/generateId'
import {
  getComponentId,
  getParentComponentId,
} from '../utils/babel-plugin-utils'
import childrenAttributeHandler from './childrenAttributeHandler'

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
            const componentType = openingElement.name.name

            // The root element of the expression container elements are already stored by the component that uses this component.
            // For example : <Layout drop={<Box></Box>}/>
            // Layout component will store the id for the Box component.

            if (path.parentPath.type !== 'JSXExpressionContainer') {
              // Store the component-id in each node
              path.node.id = componentId

              components[componentId] = {
                id: componentId,
                type: componentType,
                children: [],
                parent: isCustomComponent ? functionName : 'root',
              }
              if (parentId && componentId !== 'root') {
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
            }

            props.byComponentId[componentId] = []

            // Handles the props of the component except the children prop.
            addProps({
              path,
              props,
              components,
              openingElement,
              componentId,
              functionName,
            })

            // The children prop will be handled in this function
            childrenAttributeHandler(path, props, {
              componentId,
              componentType,
              functionName,
            })
          },
        },
      }
    })
  }
}

export default getComponentsPlugin
