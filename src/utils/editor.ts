const ALERT_COMPONENTS: ComponentType[] = [
  'AlertDescription',
  'AlertIcon',
  'AlertTitle',
]

const MENU_COMPONENTS: ComponentType[] = [
  'MenuList',
  'MenuButton',
  'MenuItem',
  'MenuGroup',
  'MenuDivider',
  'MenuOptionGroup',
  'MenuItemOption',
]

const NUMBER_INPUT_COMPONENTS: ComponentType[] = [
  'NumberInputField',
  'NumberInputStepper',
  'NumberIncrementStepper',
  'NumberDecrementStepper',
]

export const COMPONENTS: ComponentType[] = [
  ...ALERT_COMPONENTS,
  'Avatar',
  'AvatarBadge',
  'AvatarGroup',
  'Badge',
  'Box',
  'Button',
  'Checkbox',
  'CircularProgress',
  'CloseButton',
  'Code',
  'Divider',
  'Flex',
  'FormControl',
  'FormLabel',
  'FormHelperText',
  'FormErrorMessage',
  'Grid',
  'Heading',
  'Icon',
  'IconButton',
  'Image',
  'Input',
  'InputGroup',
  'InputRightAddon',
  'InputLeftAddon',
  'Link',
  'List',
  'ListItem',
  'Progress',
  'Radio',
  'RadioGroup',
  'SimpleGrid',
  'Spinner',
  'Select',
  'Stack',
  'Switch',
  'Tag',
  'Text',
  'Textarea',
  'Tab',
  'Accordion',
  'Editable',
  'AspectRatio',
  'Breadcrumb',
  'BreadcrumbItem',
  'BreadcrumbLink',
  ...MENU_COMPONENTS,
  ...NUMBER_INPUT_COMPONENTS,
  'AccordionItem',
  'AccordionButton',
  'AccordionPanel',
  'AccordionIcon',
  'InputRightElement',
  'InputLeftElement',
  // Allow meta components
  'Alert',
  'FormControl',
  'Accordion',
  'List',
  'InputGroup',
  'Breadcrumb',
  'NumberInput',
  'Menu',
  'Blog1',
  'Blog2',
  'ECommerce1',
  'ECommerce2',
  // Handlers all the custom components
  'Custom',
]

export const AccordionWhitelist: ComponentType[] = COMPONENTS.filter(
  name => !ALERT_COMPONENTS.includes(name),
)

export const MenuWhitelist: ComponentType[] = COMPONENTS.filter(
  name => !ALERT_COMPONENTS.includes(name),
)

const componentsUsedInMeta = [
  'AlertIcon',
  'AlertDescription',
  'AlertTitle',
  'AvatarBadge',
  'AccordionButton',
  'AccordionPanel',
  'AccordionIcon',
  'MenuButton',
  'MenuItem',
  'MenuGroup',
  'MenuDivider',
  'MenuOptionGroup',
  'MenuItemOption',
  'MenuList',
  'AccordionItem',
  'BreadcrumbItem',
  'BreadcrumbLink',
  'FormLabel',
  'FormHelperText',
  'FormErrorMessage',
  'InputLeftAddon',
  'InputRightAddon',
  'Input RightElement',
  'InputLeftElement',
  'ListItem',
  'NumberInputField',
  'NumberInputStepper',
  'NumberIncrementStepper',
  'NumberDecrementStepper',
]

export const rootComponents = COMPONENTS
  // Remove specific components
  .filter(name => !componentsUsedInMeta.includes(name))

export const acceptTypes: {
  [componentType: string]: ComponentType[]
} = {
  Alert: ['AlertDescription', 'AlertIcon', 'AlertTitle', ...rootComponents],
  BreadcrumbItem: ['BreadcrumbLink', ...rootComponents],
  List: ['ListItem', 'ListIcon'],
  FormControl: ['FormHelperText', 'FormErrorMessage', 'FormLabel'],
  InputGroup: [
    'InputLeftAddon',
    'InputRightAddon',
    'InputRightElement',
    'InputLeftElement',
  ],
  Breadcrumb: ['BreadcrumbItem', 'BreadcrumbLink'],
}
