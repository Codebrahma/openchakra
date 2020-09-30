import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import AlertPreview from './previews/AlertPreview'
import AvatarPreview, {
  AvatarBadgePreview,
  AvatarGroupPreview,
} from './previews/AvatarPreview'
import AccordionPreview, {
  AccordionButtonPreview,
  AccordionItemPreview,
  AccordionPanelPreview,
} from './previews/AccordionPreview'
import * as Chakra from '@chakra-ui/core'
import WithChildrenPreviewContainer from './WithChildrenPreviewContainer'
import { getComponentBy } from '../../core/selectors/components'
import PreviewContainer from './PreviewContainer'
import { InputRightElementPreview } from './previews/InputRightElement'
import { InputLeftElementPreview } from './previews/InputLeftElement'
import AspectRatioPreview from './previews/AspectRatioBoxPreview'
import MenuPreview, {
  MenuListPreview,
  MenuButtonPreview,
  MenuGroupPreview,
  MenuItemPreview,
} from './previews/MenuPreview'
import CustomComponentPreview from './previews/CustomComponentPreview'
import TextPreview from './previews/TextPreview'
import NumberInputPreview from './previews/NumberInputPreview'
import EditablePreviewContainer from './previews/EditablePreviewContainer'

const ComponentPreview: React.FC<{
  componentName: string
  customProps?: any
  customRootParentId?: string
  disableSelection?: boolean
  rootComponentChildren?: any
}> = ({
  componentName,
  customProps,
  customRootParentId,
  disableSelection,
  rootComponentChildren,
  ...forwardedProps
}) => {
  const component = useSelector(getComponentBy(componentName))
  if (!component) {
    console.error(`ComponentPreview unavailable for component ${componentName}`)
  }
  const type = (component && component.type) || null
  switch (type) {
    // Simple components
    case 'IconButton':
    case 'Image':
    case 'Link':
    case 'Spinner':
    case 'Textarea':
    case 'CircularProgress':
    case 'Switch':
    case 'FormLabel':
    case 'TabPanel':
    case 'Tab':
    case 'Input':
    case 'Radio':
    case 'BreadcrumbLink':
    case 'Select':
    case 'Checkbox':
      return (
        <PreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          customProps={customProps}
        />
      )
    case 'NumberInput':
      return (
        <NumberInputPreview
          component={component}
          {...forwardedProps}
          customProps={customProps}
        />
      )

    case 'Badge':
    case 'Button':
    case 'AlertDescription':
    case 'AlertTitle':
    case 'FormHelperText':
    case 'FormErrorMessage':
    case 'ListItem':
      return (
        <EditablePreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          customProps={customProps}
        />
      )
    case 'Text':
    case 'Heading':
      return (
        <TextPreview
          component={component}
          type={type === 'Text' ? Chakra['Box'] : Chakra['Heading']}
          {...forwardedProps}
          customProps={customProps}
        />
      )
    // Wrapped functional components (forward ref issue)
    case 'AlertIcon':
    case 'Progress':
    case 'CloseButton':
    case 'AccordionIcon':
    case 'Code':
    case 'Icon':
    case 'ListIcon':
    case 'Divider':
    case 'InputRightAddon':
    case 'InputLeftAddon':
    case 'Tag':
    case 'MenuDivider':
    case 'MenuItemOption':
      return (
        <PreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          isBoxWrapped
          customProps={customProps}
        />
      )
    // Components with childrens
    case 'Box':
    case 'SimpleGrid':
    case 'Flex':
    case 'FormControl':
    case 'Tabs':
    case 'List':
    case 'TabList':
    case 'TabPanels':
    case 'Grid':
      return (
        <WithChildrenPreviewContainer
          enableVisualHelper
          component={component}
          type={Chakra[type]}
          customProps={customProps}
          disableSelection={disableSelection}
          customRootParentId={customRootParentId}
          rootComponentChildren={rootComponentChildren}
          {...forwardedProps}
        />
      )
    case 'RadioGroup':
    case 'Stack':
    case 'Breadcrumb':
    case 'InputGroup':
    case 'BreadcrumbItem':
    case 'MenuOptionGroup':
      return (
        <WithChildrenPreviewContainer
          enableVisualHelper
          component={component}
          type={Chakra[type]}
          customProps={customProps}
          rootComponentChildren={rootComponentChildren}
          {...forwardedProps}
          isBoxWrapped
        />
      )
    // More complex components
    case 'InputRightElement':
      return (
        <InputRightElementPreview
          component={component}
          customProps={customProps}
        />
      )
    case 'InputLeftElement':
      return (
        <InputLeftElementPreview
          component={component}
          customProps={customProps}
        />
      )
    case 'Avatar':
      return <AvatarPreview component={component} customProps={customProps} />
    case 'AvatarBadge':
      return (
        <AvatarBadgePreview component={component} customProps={customProps} />
      )
    case 'AvatarGroup':
      return (
        <AvatarGroupPreview component={component} customProps={customProps} />
      )
    case 'Alert':
      return <AlertPreview component={component} customProps={customProps} />
    case 'Accordion':
      return (
        <AccordionPreview component={component} customProps={customProps} />
      )
    case 'AccordionButton':
      return (
        <AccordionButtonPreview
          component={component}
          customProps={customProps}
        />
      )
    case 'AccordionItem':
      return (
        <AccordionItemPreview component={component} customProps={customProps} />
      )
    case 'AccordionPanel':
      return (
        <AccordionPanelPreview
          component={component}
          customProps={customProps}
        />
      )
    case 'AspectRatio':
      return (
        <AspectRatioPreview component={component} customProps={customProps} />
      )
    case 'Menu':
      return <MenuPreview component={component} customProps={customProps} />
    case 'MenuList':
      return <MenuListPreview component={component} customProps={customProps} />
    case 'MenuButton':
      return (
        <MenuButtonPreview component={component} customProps={customProps} />
      )
    case 'MenuItem':
      return <MenuItemPreview component={component} customProps={customProps} />
    case 'MenuGroup':
      return (
        <MenuGroupPreview component={component} customProps={customProps} />
      )
    default:
      return (
        <CustomComponentPreview
          component={component}
          customProps={customProps}
        />
      )
  }
}

export default memo(ComponentPreview)
