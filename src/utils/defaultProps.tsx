import React from 'react'
import * as Chakra from '@chakra-ui/core'

import {
  BadgeProps,
  BoxProps,
  ButtonProps,
  IconProps,
  ImageProps,
  ProgressProps,
  AvatarGroupProps,
  AvatarProps,
  CheckboxProps,
  LinkProps,
  SpinnerProps,
  CloseButtonProps,
  HeadingProps,
  TagProps,
  SimpleGridProps,
  SwitchProps,
  AlertProps,
  FlexProps,
  StackProps,
  AccordionProps,
  AccordionButtonProps,
  AccordionItemProps,
  FormControlProps,
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabsProps,
  InputProps,
  AspectRatioProps,
  BreadcrumbItemProps,
  BreadcrumbItem,
  EditableProps,
  NumberInputProps,
  NumberInputFieldProps,
  NumberInputStepperProps,
  NumberIncrementStepperProps,
  NumberDecrementStepperProps,
  RadioProps,
  SelectProps,
  RadioGroupProps,
  InputGroupProps,
  GridProps,
  BreadcrumbLink,
  FormLabelProps,
} from '@chakra-ui/core'

type PreviewDefaultProps = {
  Badge?: BadgeProps
  Box?: BoxProps
  Button?: ButtonProps
  Icon?: any
  IconButton?: any
  Image?: ImageProps
  Text?: BoxProps
  Progress?: ProgressProps
  AvatarBadge?: any
  AvatarGroup?: Omit<AvatarGroupProps, 'children'>
  Avatar?: AvatarProps
  Checkbox?: CheckboxProps
  Link?: LinkProps
  Spinner?: SpinnerProps
  CloseButton?: CloseButtonProps
  Divider?: any
  Code?: any
  Textarea?: any
  CircularProgress?: any
  Heading?: HeadingProps
  Tag?: TagProps
  SimpleGrid?: SimpleGridProps
  Switch?: SwitchProps
  Alert?: AlertProps
  AlertIcon?: IconProps
  AlertTitle?: BoxProps
  AlertDescription?: BoxProps
  Flex?: FlexProps
  Stack?: StackProps
  Accordion?: Omit<AccordionProps, 'children'>
  AccordionButton?: AccordionButtonProps
  AccordionItem?: Omit<AccordionItemProps, 'children'>
  AccordionPanel?: any
  AccordionIcon?: IconProps
  FormControl?: FormControlProps
  FormLabel?: FormLabelProps
  FormHelperText?: any
  FormErrorMessage?: any
  Grid?: GridProps
  TabList?: TabListProps
  TabPanel?: TabPanelProps
  TabPanels?: TabPanelsProps
  Tab?: any
  Tabs?: TabsProps
  Select?: SelectProps
  Input?: InputProps
  InputGroup?: InputGroupProps
  InputLeftAddon?: any
  InputRightAddon?: any
  InputLeftElement?: any
  InputRightElement?: any
  AspectRatio?: AspectRatioProps
  Breadcrumb?: BreadcrumbItemProps
  BreadcrumbItem?: BreadcrumbItemProps
  BreadcrumbLink?: any
  Editable?: EditableProps
  Menu?: any
  MenuList?: any
  MenuButton?: any
  MenuItem?: any
  MenuGroup?: any
  MenuDivider?: any
  MenuOptionGroup?: any
  MenuItemOption?: any

  NumberInput?: NumberInputProps
  NumberInputField?: NumberInputFieldProps
  NumberInputStepper?: NumberInputStepperProps
  NumberIncrementStepper?: NumberIncrementStepperProps
  NumberDecrementStepper?: NumberDecrementStepperProps

  Radio?: RadioProps
  RadioGroup?: RadioGroupProps
  List?: any
  ListIcon?: IconProps
  ListItem?: any
  // meta components
  AlertMeta?: any
  InputGroupMeta?: any
  FormControlMeta?: any
  AccordionMeta?: any
  ListMeta?: any
  BreadcrumbMeta?: any
  MenuMeta?: any
  Custom?: any
}

export const DEFAULT_PROPS: PreviewDefaultProps = {
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

export const DEFAULT_FORM_PROPS: PreviewDefaultProps = {
  AlertTitle: {
    fontWeight: 'bold',
  },
  SimpleGrid: {
    display: 'grid',
  },
  Grid: {
    display: 'grid',
  },
  Badge: {
    variant: 'subtle',
  },
  Input: {
    variant: 'outline',
  },
  Button: {
    variant: 'solid',
    size: 'md',
    children: 'Lorem ipsum',
  },
  IconButton: {
    'aria-label': 'icon',
    size: 'md',
  },
  Spinner: {
    size: 'md',
    thickness: '2px',
    speed: '0.45s',
  },
  Heading: {
    size: 'xl',
    lineHeight: 'shorter',
    fontWeight: 'bold',
    fontFamily: 'heading',
  },
  Tag: {
    size: 'md',
    variant: 'subtle',
  },
  Textarea: {
    size: 'md',
  },
  AvatarGroup: {
    display: 'flex',
  },
  Radio: {
    size: 'md',
  },
  Select: {
    variant: 'outline',
    size: 'md',
    children: (
      <>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  },
  List: { styleType: 'none' },
  Stack: { direction: 'row', spacing: 2 },
  Flex: { display: 'flex' },
  Breadcrumb: {
    separator: '/',
  },
  CloseButton: { size: 'md' },
  BreadcrumbItem: { ...BreadcrumbItem.defaultProps },
  BreadcrumbLink: {
    ...BreadcrumbLink.defaultProps,
  },
}

export const getDefaultFormProps = (type: string) => {
  const chakraDefaultProps = Chakra[type as ComponentType]
    ? Chakra[type as ComponentType].defaultProps
    : null

  return { ...chakraDefaultProps, ...DEFAULT_FORM_PROPS[type as ComponentType] }
}
