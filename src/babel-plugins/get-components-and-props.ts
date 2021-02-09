import { declare } from '@babel/helper-plugin-utils'
import { getComponentId } from './utils/babel-plugin-utils'
import addProps from './generate-components-state/addProps'
import childrenAttributeHandler from './generate-components-state/childrenAttributeHandler'

class generateComponentsState {
  state: {
    components: IComponents
    props: IProps
    rootComponentId: string
  }
  plugin: any
  constructor(options: { parentId: string }) {
    // The state of the babel.
    this.state = {
      components: {},
      props: {
        byId: {},
        byComponentId: {},
      },
      rootComponentId: '',
    }

    const { parentId } = options

    this.plugin = declare(() => {
      const components = this.state.components
      const props = this.state.props

      return {
        visitor: {
          JSXElement: (path: any) => {
            // This handles the icon component(<Button leftIcon={<ArrowDown />}>Click</Button>)
            if (path.parentPath.type === 'JSXExpressionContainer') return
            const openingElement = path.node.openingElement

            const id = getComponentId(openingElement)
            const type = openingElement.name.name

            // The parent-id will be stored for the root element of the meta component
            const parent =
              path.parentPath.node.type === 'JSXElement'
                ? getComponentId(path.parentPath.node.openingElement)
                : parentId

            components[id] = {
              id,
              type,
              parent,
              children: [],
            }

            // The parent of the root element will not be a JSX Element
            if (path.parentPath.node.type !== 'JSXElement') {
              this.state.rootComponentId = id
            } else {
              components[parent].children.push(id)
            }

            props.byComponentId[id] = []

            // Handles the props of the component except the children prop.
            addProps({
              path,
              props,
              components,
              openingElement,
              componentId: id,
              functionName: '',
            })

            // The children prop will be handled in this function
            childrenAttributeHandler(path, props, {
              componentId: id,
              componentType: type,
              functionName: '',
            })
          },
        },
      }
    })
  }
}

export default generateComponentsState
