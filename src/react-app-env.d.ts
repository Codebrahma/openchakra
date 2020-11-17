/// <reference types="react-scripts" />;
declare module 'prettier/standalone'
declare module 'coloreact'
declare module 'browser-nativefs'

type ComponentType =
  | 'AspectRatio'
  | 'Badge'
  | 'Box'
  | 'Button'
  | 'Breadcrumb'
  | 'Icon'
  | 'IconButton'
  | 'Image'
  | 'Text'
  | 'Progress'
  | 'AvatarBadge'
  | 'AvatarGroup'
  | 'Avatar'
  | 'Checkbox'
  | 'Link'
  | 'Spinner'
  | 'CloseButton'
  | 'Divider'
  | 'Textarea'
  | 'CircularProgress'
  | 'Heading'
  | 'Tag'
  | 'Switch'
  | 'SimpleGrid'
  | 'Alert'
  | 'AlertIcon'
  | 'AlertTitle'
  | 'AlertDescription'
  | 'Flex'
  | 'Stack'
  | 'Accordion'
  | 'AccordionItem'
  | 'AccordionButton'
  | 'AccordionPanel'
  | 'AccordionIcon'
  | 'FormControl'
  | 'FormLabel'
  | 'FormHelperText'
  | 'FormErrorMessage'
  | 'TabList'
  | 'TabPanel'
  | 'TabPanels'
  | 'Tab'
  | 'Tabs'
  | 'Code'
  | 'Editable'
  | 'NumberInput'
  | 'Radio'
  | 'RadioGroup'
  | 'Select'
  | 'List'
  | 'ListItem'
  | 'ListIcon'
  | 'Input'
  | 'InputGroup'
  | 'InputLeftAddon'
  | 'InputRightAddon'
  | 'InputLeftElement'
  | 'InputRightElement'
  | 'Grid'
  | 'BreadcrumbItem'
  | 'BreadcrumbLink'
  | 'Menu'
  | 'MenuList'
  | 'MenuButton'
  | 'MenuItem'
  | 'MenuGroup'
  | 'MenuDivider'
  | 'MenuOptionGroup'
  | 'MenuItemOption'
  | 'NumberInputField'
  | 'NumberInputStepper'
  | 'NumberIncrementStepper'
  | 'NumberDecrementStepper'

type MetaComponentType =
  | 'FormControlMeta'
  | 'AccordionMeta'
  | 'ListMeta'
  | 'AlertMeta'
  | 'InputGroupMeta'
  | 'BreadcrumbMeta'
  | 'MenuMeta'
  | 'NumberInputMeta'
  | 'Custom'

interface PropRef {
  customPropName: string
  targetedProp: string
  value?: string
}

interface PropRefs {
  [name: string]: PropRef
}

interface ExposedChildren {
  [name: string]: string[]
}

interface IComponent {
  id: string
  type: ComponentType | string
  parent: string
  children: string[]
  isWrapperComponent?: boolean
}

interface IComponents {
  [name: string]: IComponent
}

interface IComponentsById {
  [name: string]: IComponents
}

interface IPreviewProps {
  component: IComponent
  customProps?: any
}

interface ComponentItemProps {
  id: string
  label: string
  type: ComponentType
  isMoved?: boolean
  isChild?: boolean
  isMeta?: boolean
  soon?: boolean
  rootParentType?: ComponentType
  custom?: boolean
}

interface IPage {
  id: string
  name: string
  componentsId: string
  propsId: string
}

interface IPages {
  [name: string]: IPage
}

interface IProp {
  id: string
  name: string
  value: string | any
  derivedFromPropName: string | null
  derivedFromComponentType: string | null
}

interface IPropsById {
  [propId: string]: IProp
}

interface IPropsByComponentId {
  [componentId: string]: IProp['id'][]
}

interface IProps {
  byId: IPropsById
  byComponentId: IPropsByComponentId
}

interface IPropsByPageId {
  [id: string]: IProps
}
