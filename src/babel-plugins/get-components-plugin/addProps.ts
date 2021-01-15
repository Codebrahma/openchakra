import * as t from '@babel/types'
import { generatePropId } from '../../utils/generateId'
import traverse from '@babel/traverse'

export const expressionContainerValueHandler = (path: any, expression: any) => {
  switch (expression.type) {
    case 'Identifier': {
      const functionPath = path.getFunctionParent()
      const identifierName = expression.name

      // As of now, identifer values can be string or number.
      let identifierValue: string | number = ``

      traverse(
        functionPath.node,
        {
          VariableDeclarator(path: any) {
            if (path.node.id.name !== identifierName) return
            identifierValue = path.node.init.value
          },
        },
        functionPath.scope,
        functionPath.state,
        functionPath,
      )

      return identifierValue
    }
    case 'ObjectExpression': {
      const propValue: any = {}
      expression.properties.forEach(
        (property: any) => (propValue[property.key.name] = property.value),
      )
      return propValue
    }
    case 'ArrayExpression': {
      const propValue = expression.elements.map((node: any) => node.value)
      return propValue
    }
    case 'NumericLiteral': {
      return expression.value
    }
    case 'BooleanLiteral': {
      return expression.value
    }

    default: {
      return ''
    }
  }
}

type IAddProps = {
  path: any
  props: IProps
  openingElement: any
  componentId: string
}

const addProps = (payload: IAddProps) => {
  const { path, props, openingElement, componentId } = payload
  // Get the props of each component by attributes property
  openingElement.attributes.forEach((attr: any) => {
    const propName = attr.name.name
    // component-id need not to be added as the prop for the component.
    if (propName === 'compId') return
    const value = attr.value
    const propId = generatePropId()
    props.byComponentId[componentId].push(propId)

    // We have to check whether the prop-value is string or number or object or array or the value is exposed.
    // Examples : value='hello' || value={2} || value={[1,2,3]} || value={textValue}
    if (value && t.isJSXExpressionContainer(value)) {
      props.byId[propId] = {
        id: propId,
        name: propName,
        value: '',
        derivedFromPropName: null,
        derivedFromComponentType: null,
      }
      props.byId[propId].value = expressionContainerValueHandler(
        path,
        value.expression,
      )
    } else {
      // If the value is null, it can be boolean prop.
      // Example <Container isCenter />
      props.byId[propId] = {
        id: propId,
        name: attr.name.name,
        value: value ? value.value : true,
        derivedFromPropName: null,
        derivedFromComponentType: null,
      }
    }
  })
}

export default addProps
