import * as t from '@babel/types'
import { generatePropId } from '../../utils/generateId'

// The identifier can either refer to the props of the custom component or any variables.
// We need to differentiate between both.
// For Example:
// const Card=({bg})=><Text bg={bg}>This is card</Text>
/* const Card=()=>{
          const bg='red.500'
          return (
            <Text bg={bg}>This is card</Text>
          )
        } */

type IIdentifierPropHandler = {
  identifierName: string
  path: any
  propId: string
  props: IProps
  functionName: string
}
export const identifierPropHandler = (payload: IIdentifierPropHandler) => {
  const { identifierName, path, propId, props, functionName } = payload
  const customComponentRootProps =
    functionName !== 'App' ? props.byComponentId[functionName] : []

  const isIdentifierPresentInProp =
    customComponentRootProps.findIndex(
      propId => props.byId[propId].name === identifierName,
    ) !== -1

  if (isIdentifierPresentInProp) {
    props.byId[propId].derivedFromPropName = identifierName
    props.byId[propId].derivedFromComponentType =
      functionName === 'App' ? null : functionName
  } else {
    // To fetch the value from the variable defined above the return statement.
    path.parentPath.container.forEach((node: any) => {
      if (
        node.type === 'VariableDeclaration' &&
        node.declarations[0].id.name === identifierName
      ) {
        props.byId[propId].value = node.declarations[0].init.value
      }
    })
  }
}

type IAddProps = {
  path: any
  props: IProps
  openingElement: any
  componentId: string
  functionName: string
}

const addProps = (payload: IAddProps) => {
  const { path, props, openingElement, componentId, functionName } = payload
  // Get the props of each component by attributes property
  openingElement.attributes.forEach((attr: any) => {
    const value = attr.value
    const propId = generatePropId()
    props.byComponentId[componentId].push(propId)

    // We have to check whether the prop-value is string or number or object or array or the value is exposed.
    // Examples : value='hello' || value={2} || value={[1,2,3]} || value={textValue}
    if (value && t.isJSXExpressionContainer(value)) {
      props.byId[propId] = {
        id: propId,
        name: attr.name.name,
        value: '',
        derivedFromPropName: null,
        derivedFromComponentType: null,
      }
      switch (value.expression.type) {
        case 'Identifier': {
          identifierPropHandler({
            identifierName: value.expression.name,
            path,
            propId,
            props,
            functionName,
          })
          break
        }
        case 'ObjectExpression': {
          const propValue: any = {}
          value.expression.properties.forEach(
            (property: any) =>
              (propValue[property.key.name] = property.value.value),
          )
          props.byId[propId].value = propValue
          break
        }
        case 'ArrayExpression': {
          const propValue = value.expression.elements.map(
            (node: any) => node.value,
          )
          props.byId[propId].value = propValue
          break
        }
        case 'NumericLiteral': {
          props.byId[propId].value = value.expression.value
          break
        }
        case 'BooleanLiteral': {
          props.byId[propId].value = value.expression.value
          break
        }
        case 'ArrowFunctionExpression': {
          // This handles if there are inline functions.
          // Functions are not needed for the composer workspace so those can be removed from the props.
          delete props.byId[propId]
          const propIdIndex = props.byComponentId[componentId].findIndex(
            id => propId === id,
          )
          props.byComponentId[componentId].splice(propIdIndex, 1)
          break
        }
        default: {
          break
        }
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
