import { getComponentId } from './utils/babel-plugin-utils'
import template from '@babel/template'
import * as t from '@babel/types'
import checkIsComponentId from '../utils/checkIsComponentId'

const addCustomComponentPlugin = (
  _: any,
  options: {
    componentId: string
    parentId: string
    type: string
    defaultProps: IProp[]
    isContainerComponent: boolean
  },
) => {
  const {
    componentId,
    parentId,
    type,
    defaultProps,
    isContainerComponent,
  } = options

  // If the value of the prop is a component-id, then the box component should be added.
  // or else its respective value will be added.
  //TODO remove scope and pass as argument
  //TODO break into two function, filter, then map
  const defaultPropsProvider = () => {
    return defaultProps
      .filter(prop => prop.name !== 'children')
      .map(prop => {
        if (checkIsComponentId(prop.value)) {
          return `${prop.name}={<Box compId="${prop.value}"></Box>}`
        } else {
          return `${prop.name}="${prop.value}"`
        }
      })
      .join(' ')
  }

  const buildImportDeclaration = (name: string) =>
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(name))],
      t.stringLiteral(`./components/${name}.js`),
    )

  return {
    visitor: {
      Program(path: any) {
        const importDeclarations = path.node.body.filter(
          (declaration: any) => declaration.type === 'ImportDeclaration',
        )

        const isComponentImported =
          importDeclarations.findIndex(
            (declaration: any) =>
              declaration.source.value === `./components/${type}.js`,
          ) !== -1

        if (isComponentImported) return

        path.node.body.splice(
          importDeclarations.length,
          0,
          buildImportDeclaration(type),
        )
      },
      JSXElement(path: any) {
        const openingElement = path.node.openingElement

        const visitedComponentId = getComponentId(openingElement)
        if (visitedComponentId && visitedComponentId !== parentId) {
          return
        }

        let component: string = ``

        // If the component is container component, the element will be <Card></Card>
        // If the component is not a container component, the element will be <Card />

        if (isContainerComponent) {
          component = `<${type} compId="${componentId}" ${defaultPropsProvider()}></${type}>`
        } else {
          component = `<${type} compId="${componentId}" ${defaultPropsProvider()}/>`
        }

        // Change the JSX element in the string to node template
        const node = template.ast(component, {
          plugins: ['jsx'],
        }).expression
        const newLineText = t.jsxText('\n')

        // Add to the children of the parent component
        if (path.node.children.length > 0) {
          path.node.children.push(node)
          path.node.children.push(newLineText)
        } else {
          path.node.children = [newLineText, node, newLineText]
        }
      },
    },
  }
}

export default addCustomComponentPlugin
