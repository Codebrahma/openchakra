// Builds and gives componentIds for meta components.
import { generateComponentId } from './generateId'

const buildComponentIds = (componentId: string, components: IComponents) => {
  const componentIds: string[] = []
  const buildComponentIdsRecursively = (component: IComponent) => {
    const newComponentId = generateComponentId()
    componentIds.push(newComponentId)

    component.children.forEach(childId =>
      buildComponentIdsRecursively(components[childId]),
    )
  }
  buildComponentIdsRecursively(components[componentId])
  return componentIds
}

export default buildComponentIds
