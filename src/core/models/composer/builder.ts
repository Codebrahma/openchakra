import Composer from './composer'

type ComposedComponent = {
  components: IComponents
  componentIds: string[]
  root: string
  parent: string
}

// The order of builder and default components structure should be same.
// When you add a meta component, the default component structure and also the builder file should be updated.

export const buildAlert = (parent: string): ComposedComponent => {
  const composer = new Composer()
  const nodeId = composer.addNode({ type: 'Alert', parent })
  composer.addNode({ type: 'AlertIcon', parent: nodeId })
  composer.addNode({ type: 'AlertTitle', parent: nodeId })
  composer.addNode({ type: 'AlertDescription', parent: nodeId })
  const { componentIds, components } = composer.getComponents()
  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildBreadcrumb = (parent: string): ComposedComponent => {
  const composer = new Composer()
  const nodeId = composer.addNode({ type: 'Breadcrumb', parent })
  const itemId = composer.addNode({ type: 'BreadcrumbItem', parent: nodeId })
  composer.addNode({ type: 'BreadcrumbLink', parent: itemId })

  const secondItemId = composer.addNode({
    type: 'BreadcrumbItem',
    parent: nodeId,
  })
  composer.addNode({ type: 'BreadcrumbLink', parent: secondItemId })

  const { components, componentIds } = composer.getComponents()

  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildFormControl = (parent: string): ComposedComponent => {
  const composer = new Composer()
  const nodeId = composer.addNode({ type: 'FormControl', parent })
  composer.addNode({ type: 'FormLabel', parent: nodeId })
  composer.addNode({ type: 'Input', parent: nodeId, rootParentType: 'Input' })
  composer.addNode({ type: 'FormHelperText', parent: nodeId })
  composer.addNode({ type: 'FormErrorMessage', parent: nodeId })

  const { componentIds, components } = composer.getComponents()

  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildAccordion = (parent: string): ComposedComponent => {
  const composer = new Composer('Accordion')
  const nodeId = composer.addNode({ type: 'Accordion', parent })
  const itemId = composer.addNode({ type: 'AccordionItem', parent: nodeId })
  const headerId = composer.addNode({ type: 'AccordionButton', parent: itemId })
  composer.addNode({ type: 'Text', parent: headerId, rootParentType: 'Text' })
  composer.addNode({ type: 'AccordionIcon', parent: headerId })
  const panelId = composer.addNode({ type: 'AccordionPanel', parent: itemId })
  composer.addNode({ type: 'Box', parent: panelId, rootParentType: 'Box' })

  const { componentIds, components } = composer.getComponents()

  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildMenu = (parent: string): ComposedComponent => {
  const composer = new Composer('Menu')
  const nodeId = composer.addNode({ type: 'Menu', parent })
  const menuId = composer.addNode({ type: 'MenuButton', parent: nodeId })
  composer.addNode({
    type: 'Button',
    parent: menuId,
    props: { leftIcon: 'chevron-down' },
  })
  const listId = composer.addNode({ type: 'MenuList', parent: nodeId })
  const menuItemOne = composer.addNode({ type: 'MenuItem', parent: listId })
  composer.addNode({
    type: 'Text',
    parent: menuItemOne,
    rootParentType: 'Text',
  })
  const menuItemTwo = composer.addNode({ type: 'MenuItem', parent: listId })
  composer.addNode({
    type: 'Text',
    parent: menuItemTwo,
    rootParentType: 'Text',
  })

  const { componentIds, components } = composer.getComponents()
  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildList = (parent: string): ComposedComponent => {
  const composer = new Composer('List')
  const nodeId = composer.addNode({ type: 'List', parent })
  composer.addNode({ type: 'ListItem', parent: nodeId })
  const { componentIds, components } = composer.getComponents()

  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildInputGroup = (parent: string): ComposedComponent => {
  const composer = new Composer('Input')
  const nodeId = composer.addNode({ type: 'InputGroup', parent })
  composer.addNode({
    type: 'InputLeftAddon',
    parent: nodeId,
    props: { children: 'Email' },
  })
  composer.addNode({ type: 'Input', parent: nodeId })
  const elementId = composer.addNode({
    type: 'InputRightElement',
    parent: nodeId,
  })
  composer.addNode({
    type: 'Icon',
    parent: elementId,
    props: { name: 'email' },
  })
  const { componentIds, components } = composer.getComponents()
  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

export const buildNumberInput = (parent: string): ComposedComponent => {
  const composer = new Composer()
  const nodeId = composer.addNode({ type: 'NumberInput', parent })
  composer.addNode({ type: 'NumberInputField', parent: nodeId })
  const stepperId = composer.addNode({
    type: 'NumberInputStepper',
    parent: nodeId,
    rootParentType: 'Input',
  })
  composer.addNode({ type: 'NumberIncrementStepper', parent: stepperId })
  composer.addNode({ type: 'NumberDecrementStepper', parent: stepperId })

  const { componentIds, components } = composer.getComponents()

  return {
    components,
    componentIds,
    root: nodeId,
    parent,
  }
}

type BuilderFn = (parent: string) => ComposedComponent

type ComposerBuilders = {
  [k: string]: BuilderFn
}

const builders: ComposerBuilders = {
  AlertMeta: buildAlert,
  FormControlMeta: buildFormControl,
  AccordionMeta: buildAccordion,
  ListMeta: buildList,
  InputGroupMeta: buildInputGroup,
  BreadcrumbMeta: buildBreadcrumb,
  MenuMeta: buildMenu,
  NumberInputMeta: buildNumberInput,
}

export default builders
