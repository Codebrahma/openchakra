import {
  getComponentId,
  toJsxText,
  getJSXElement,
} from './utils/babel-plugin-utils'

export type ISpanComponentsValues = { [spanComponentId: string]: string }

const setPropPlugin = (
  _: any,
  options: {
    componentId: string
    value: string[]
    spanComponentsValues: ISpanComponentsValues
  },
) => {
  const { componentId, value, spanComponentsValues } = options

  return {
    visitor: {
      JSXElement(path: any) {
        const openingElement = path.node.openingElement
        const visitedComponentId = getComponentId(openingElement)

        if (visitedComponentId !== componentId) return

        const children: any = []

        // If it is span element, create the span component and push it to the children array.
        // or else just push the value to the children array.
        value.forEach(val => {
          if (spanComponentsValues[val]) {
            const element = `<Box as="span" compId="${val}">${spanComponentsValues[val]}</Box>`
            children.push(getJSXElement(element))
          } else {
            children.push(toJsxText(val))
          }
        })
        path.node.children = children
      },
    },
  }
}

export default setPropPlugin
