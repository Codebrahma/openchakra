import * as t from '@babel/types'
import { generatePropId } from '../../utils/generateId'
import traverse from '@babel/traverse'
import { getComponentId } from '../utils/babel-plugin-utils'

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

      return { value: identifierValue, derivedFromPropName: null }
    }
    case 'ObjectExpression': {
      const propValue: any = {}
      expression.properties.forEach(
        (property: any) => (propValue[property.key.name] = property.value),
      )

      return { value: propValue, derivedFromPropName: null }
    }
    case 'ArrayExpression': {
      const propValue = expression.elements.map((node: any) => node.value)
      return { value: propValue, derivedFromPropName: null }
    }
    case 'NumericLiteral': {
      return { value: expression.value, derivedFromPropName: null }
    }
    case 'BooleanLiteral': {
      return { value: expression.value, derivedFromPropName: null }
    }

    case 'MemberExpression': {
      if (expression.object.name === 'props')
        return { value: '', derivedFromPropName: expression.property.name }
      else return { value: '', derivedFromPropName: null }
    }

    case 'JSXElement': {
      const componentId = getComponentId(expression.openingElement)
      expression.id = componentId
      return {
        component: {
          id: componentId,
          type: 'Box',
          parent: 'prop',
          children: [],
        },
        value: componentId,
      }
    }

    default: {
      return { value: '', derivedFromPropName: null }
    }
  }
}

type IAddProps = {
  path: any
  props: IProps
  components: IComponents
  openingElement: any
  componentId: string
  functionName: string
}

const addProps = (payload: IAddProps) => {
  const {
    path,
    props,
    components,
    openingElement,
    componentId,
    functionName,
  } = payload
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
      const {
        value: propValue,
        derivedFromPropName,
        component,
      } = expressionContainerValueHandler(path, value.expression)

      props.byId[propId].value = propValue

      if (derivedFromPropName) {
        // update the exposed prop
        props.byId[propId].derivedFromPropName = derivedFromPropName
        props.byId[propId].derivedFromComponentType = functionName

        // Add the custom prop to the root of the component.
        const newPropId = generatePropId()

        props.byComponentId[functionName].push(newPropId)

        props.byId[newPropId] = {
          id: newPropId,
          name: derivedFromPropName,
          value: '',
          derivedFromComponentType: null,
          derivedFromPropName: null,
        }
      }
      if (component) {
        components[component.id] = { ...component }
      }
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
