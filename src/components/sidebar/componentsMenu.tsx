type MenuItem = {
  children?: MenuItems
  rootParentType?: ComponentType
  isMeta?: boolean
}

type MenuItems = Partial<
  {
    [k in ComponentType]: MenuItem
  }
>

export const menuItems: MenuItems = {
  Accordion: {
    children: {
      AccordionItem: {},
      AccordionButton: {},
      AccordionPanel: {},
      AccordionIcon: {},
    },
    isMeta: true,
  },
  Alert: {
    children: {
      AlertDescription: {},
      AlertIcon: {},
      AlertTitle: {},
    },
    isMeta: true,
  },
  AspectRatio: {},
  AvatarGroup: {
    rootParentType: 'Avatar',
  },
  Avatar: {},
  AvatarBadge: {
    rootParentType: 'Avatar',
  },
  Badge: {},
  Box: {},
  Breadcrumb: {
    children: {
      BreadcrumbItem: {},
      BreadcrumbLink: {},
    },
    isMeta: true,
  },
  Button: {},
  Checkbox: {},
  CircularProgress: {},
  CloseButton: {},
  Code: {},
  Divider: {},
  Flex: {},
  FormControl: {
    children: {
      FormLabel: {},
      FormHelperText: {},
    },
    isMeta: true,
  },
  Grid: {},
  Heading: {},
  Icon: {},
  IconButton: {},
  Image: {},
  Input: {},
  InputGroup: {
    rootParentType: 'Input',
    children: {
      Input: {},
      InputLeftAddon: {},
      InputRightAddon: {},
      InputRightElement: {},
      InputLeftElement: {},
    },

    isMeta: true,
  },
  Link: {},
  List: {
    children: {
      ListItem: {},
    },
  },
  Menu: {
    children: {
      MenuList: {},
      MenuButton: {},
      MenuItem: {},
      // MenuGroup: {},
      MenuDivider: {},
      // MenuOptionGroup: {},
      // MenuItemOption: {},
    },
    isMeta: true,
  },
  NumberInput: {
    children: {
      NumberInputStepper: {},
      NumberIncrementStepper: {},
      NumberDecrementStepper: {},
    },
    isMeta: true,
  },
  Progress: {},
  Radio: {},
  RadioGroup: {
    rootParentType: 'Radio',
  },
  SimpleGrid: {},
  Spinner: {},
  Select: {},
  Stack: {},
  Switch: {},
  Tag: {},
  Text: {},
  Textarea: {},
  /*"Tabs",
  "TabList",
  "TabPanel",
  "TabPanels"*/
}
