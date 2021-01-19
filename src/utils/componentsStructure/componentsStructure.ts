import metaComponents from './metaComponents/metaComponentsStructure'
import normalComponents from './normalComponents'

const componentsStructure: { [compName: string]: string } = {
  ...normalComponents,
  ...metaComponents,
}

export default componentsStructure
