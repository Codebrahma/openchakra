import { generateComponentId } from '../../../utils/generateId'

type AddNode = {
  type: ComponentType
  parent?: string
  props?: any
  rootParentType?: ComponentType
}

class Composer {
  components: IComponents = {}
  componentIds: string[] = []

  rootComponentType: ComponentType | undefined = undefined

  constructor(name?: ComponentType) {
    if (name) {
      this.rootComponentType = name
    }
  }

  addNode = ({ type, parent = 'root' }: AddNode): string => {
    const id = generateComponentId()

    if (parent === 'root' && !this.rootComponentType) {
      this.rootComponentType = type
    }

    this.components = {
      ...this.components,
      [id]: {
        type,
        parent,
        id,
        children: [],
      },
    }

    this.componentIds.push(id)
    if (parent !== 'root' && this.components[parent]) {
      this.components[parent].children.push(id)
    }

    return id
  }

  getComponents() {
    return { components: this.components, componentIds: this.componentIds }
  }
}

export default Composer
