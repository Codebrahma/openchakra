import { generateId } from '../../../utils/generateId'

type AddNode = {
  type: ComponentType
  parent?: string
  props?: any
  rootParentType?: ComponentType
}

class Composer {
  components: IComponents = {}

  rootComponentType: ComponentType | undefined = undefined

  constructor(name?: ComponentType) {
    if (name) {
      this.rootComponentType = name
    }
  }

  addNode = ({ type, parent = 'root' }: AddNode): string => {
    const id = generateId()

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
    if (parent !== 'root' && this.components[parent]) {
      this.components[parent].children.push(id)
    }

    return id
  }

  getComponents() {
    return this.components
  }
}

export default Composer
