type IDefaultProps = {
  [name: string]: any
}

/**
 * @member
 * @name DEFAULT_PROPS
 * @description This will Provide default props for each and every component.
 */
export const DEFAULT_PROPS: IDefaultProps = {
  Badge: {
    children: 'Badge name',
  },
  Button: {
    children: 'Button text',
  },
  Divider: { borderColor: 'blackAlpha.500' },
  IconButton: {
    'aria-label': 'icon',
    icon: 'CopyIcon',
  },
  Icon: { as: 'CopyIcon' },
  Image: {
    height: '100px',
    width: '100px',
    src: 'https://dummyimage.com/100x100',
  },
  Text: { children: 'Text value' },
  Link: { children: 'Link text' },
  Code: {
    children: 'Code value',
  },
  Heading: {
    children: 'Heading title',
  },
  Tag: {
    children: 'Tag name',
  },
  SimpleGrid: {
    columns: 2,
    spacingX: 1,
    spacingY: 1,
  },
  Checkbox: {
    children: 'Label checkbox',
    isChecked: false,
  },
  Switch: {
    isChecked: false,
  },
  Progress: {
    value: 50,
  },
  CircularProgress: {
    value: 50,
    size: '48px',
  },
  AlertIcon: {
    height: 8,
  },
  AlertTitle: {
    children: 'Alert title',
    mr: 1,
  },
  AlertDescription: {
    children: 'Alert description',
  },
  AvatarBadge: {
    bg: 'green.500',
    boxSize: '1.25em',
    borderColor: 'white',
  },
  TabPanel: { children: 'Tab' },
  Tab: { children: 'Tab' },
  FormLabel: { children: 'Label' },
  FormHelperText: {
    children: 'Helper message',
  },
  FormErrorMessage: {
    children: 'Error message',
  },
  Grid: {
    templateColumns: 'repeat(5, 1fr)',
    gap: 6,
  },
  Radio: { children: 'Radio' },
  ListItem: { children: 'list' },
  AccordionItem: {},
  InputLeftAddon: { children: 'left' },
  InputRightAddon: {
    children: 'right',
  },
  BreadcrumbLink: {
    children: 'Lorem Ipsum',
  },
  AvatarGroup: {
    spacing: -3,
    max: 3,
    size: 'md',
  },
  Select: {},
  Menu: {
    isOpen: true,
  },
  MenuList: {},
  MenuButton: {},
  MenuItem: {},
  MenuGroup: {},
  MenuDivider: {},
  MenuOptionGroup: {},
  MenuItemOption: {},
}
