import metaComponents from './metaComponents/metaComponentsStructure'
import normalComponents from './normalComponents'

const Card = `<Box>
<Text fontSize="4xl" fontStyle="italic">
  This is newer form of text
</Text>
<Button colorScheme="whatsapp" size="lg">Click here</Button>
</Box>`

const componentsStructure: { [compName: string]: string } = {
  Card,
  ...normalComponents,
  ...metaComponents,
}

export default componentsStructure
