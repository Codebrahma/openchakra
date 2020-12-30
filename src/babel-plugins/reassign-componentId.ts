import { generateComponentId } from '../utils/generateId'

const reassignComponentId = () => {
  return {
    visitor: {
      JSXOpeningElement(path: any) {
        const componentId = generateComponentId()
        const compIdPropIndex = path.node.attributes.findIndex(
          (node: any) => node.name.name === 'compId',
        )

        path.node.attributes[compIdPropIndex].value.value = componentId
      },
    },
  }
}

export default reassignComponentId
