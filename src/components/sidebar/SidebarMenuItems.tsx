import buttonImage from '../../images/components-images/button.png'
import badgeImage from '../../images/components-images/badge.png'
import inputImage from '../../images/components-images/input.png'
import textAreaImage from '../../images/components-images/textArea.png'
import checkboxImage from '../../images/components-images/checkbox.png'
import radioButtonImage from '../../images/components-images/radioButton.png'
import Image from '../../images/components-images/image.png'
import avatarImage from '../../images/components-images/avatar.png'
import blogImage1 from '../../images/components-images/blog1.png'
import blogImage2 from '../../images/components-images/blog2.png'
import pricingImage1 from '../../images/components-images/pricing1.png'
import eCommerceImage1 from '../../images/components-images/eCommerce1.png'
import eCommerceImage2 from '../../images/components-images/eCommerce2.png'
import TeamImage1 from '../../images/components-images/team1.png'
import FormControlImage from '../../images/components-images/formControl.png'
import InputGroupImage from '../../images/components-images/inputGroup.png'
import headingImage1 from '../../images/components-images/heading1.png'
import headingImage2 from '../../images/components-images/heading2.png'
import headingImage3 from '../../images/components-images/heading3.png'
import headingImage4 from '../../images/components-images/heading4.png'
import headingImage5 from '../../images/components-images/heading5.png'
import headingImage6 from '../../images/components-images/heading6.png'
import textImage from '../../images/components-images/text.png'
import boxImage from '../../images/components-images/box.png'
import flexImage from '../../images/components-images/flex.png'
import gridImage from '../../images/components-images/grid.png'
import avatarGroupImage from '../../images/components-images/avatarGroup.png'
import radioGroupImage from '../../images/components-images/radioGroup.png'
import aspectRatioImage from '../../images/components-images/aspectRatio.png'
import progressImage from '../../images/components-images/progress.png'
import circularProgressImage from '../../images/components-images/circularProgress.png'
import selectImage from '../../images/components-images/select.png'
import tagNameImage from '../../images/components-images/tagName.png'
import numberInputImage from '../../images/components-images/numberInput.png'
import alertImage from '../../images/components-images/alert.png'
import switchImage from '../../images/components-images/switch.png'
import spinnerImage from '../../images/components-images/spinner.png'
import contactImage1 from '../../images/components-images/contact1.png'
import breadcrumbImage from '../../images/components-images/breadcrumb.png'
import listImage from '../../images/components-images/list.png'
import accordionImage from '../../images/components-images/accordion.png'
import iconImage from '../../images/components-images/icon.png'
import iconButtonImage from '../../images/components-images/iconButton.png'
import closeButtonImage from '../../images/components-images/closeButton.png'
import linkImage from '../../images/components-images/link.png'

export type IMenuComponent = {
  name: string
  label: string
  image?: string
  children?: IMenuComponent[]
  custom?: boolean
}

export type IMenuItem = {
  name: string
  components: IMenuComponent[]
}

export type IMenuItems = {
  [itemName: string]: IMenuItem
}

const menuItems: IMenuItems = {
  Containers: {
    name: 'Containers',
    components: [
      {
        name: 'Box',
        label: 'Box',
        image: boxImage,
      },
      {
        name: 'Flex',
        label: 'Flex',
        image: flexImage,
      },
      {
        name: 'Grid',
        label: 'Grid',
        image: gridImage,
      },
      {
        name: 'AvatarGroup',
        label: 'Avatar Group',
        image: avatarGroupImage,
      },
      {
        name: 'RadioGroup',
        label: 'Radio Group',
        image: radioGroupImage,
      },
      {
        name: 'AspectRatio',
        label: 'Aspect Ratio',
        image: aspectRatioImage,
      },
    ],
  },
  Elements: {
    name: 'Elements',
    components: [
      {
        name: 'Button',
        label: 'Button',
        image: buttonImage,
      },
      {
        name: 'Avatar',
        label: 'Avatar',
        children: [
          {
            name: 'Avatar',
            label: 'Avatar',
            image: avatarImage,
          },
          {
            name: 'AvatarBadge',
            label: 'Avatar Badge',
          },
        ],
      },
      {
        name: 'Badge',
        label: 'Badge',
        image: badgeImage,
      },
      {
        name: 'Image',
        label: 'Image',
        image: Image,
      },

      {
        name: 'Progress',
        label: 'Progress',
        image: progressImage,
      },
      {
        name: 'CircularProgress',
        label: 'Circular Progress',
        image: circularProgressImage,
      },
      {
        name: 'Switch',
        label: 'Switch',
        image: switchImage,
      },
      {
        name: 'TagName',
        label: 'Tag Name',
        image: tagNameImage,
      },
      {
        name: 'Link',
        label: 'Link',
        image: linkImage,
      },
      {
        name: 'Spinner',
        label: 'Spinner',
        image: spinnerImage,
      },
      {
        name: 'Icon',
        label: 'Icon',
        image: iconImage,
      },
      {
        name: 'IconButton',
        label: 'Icon Button',
        image: iconButtonImage,
      },
      {
        name: 'CloseButton',
        label: 'Close Button',
        image: closeButtonImage,
      },
      {
        name: 'Divider',
        label: 'Divider',
      },
    ],
  },
  Typography: {
    name: 'Typography',
    components: [
      {
        name: 'Heading1',
        label: 'Heading-1',
        image: headingImage1,
      },
      {
        name: 'Heading2',
        label: 'Heading-2',
        image: headingImage2,
      },
      {
        name: 'Heading3',
        label: 'Heading-3',
        image: headingImage3,
      },
      {
        name: 'Heading4',
        label: 'Heading-4',
        image: headingImage4,
      },
      {
        name: 'Heading5',
        label: 'heading-5',
        image: headingImage5,
      },
      {
        name: 'Heading6',
        label: 'Heading-6',
        image: headingImage6,
      },
      {
        name: 'Text',
        label: 'Text',
        image: textImage,
      },
    ],
  },
  MetaElements: {
    name: 'Meta Elements',
    components: [
      {
        name: 'Alert',
        label: 'Alert',
        children: [
          {
            name: 'Alert',
            label: 'Alert',
            image: alertImage,
          },
          {
            name: 'AlertIcon',
            label: 'Alert Icon',
          },
          {
            name: 'AlertTitle',
            label: 'Alert Title',
          },
          {
            name: 'AlertDescription',
            label: 'Alert Description',
          },
        ],
      },
      {
        name: 'Breadcrumb',
        label: 'Breadcrumb',
        children: [
          {
            name: 'Breadcrumb',
            label: 'Breadcrumb',
            image: breadcrumbImage,
          },
          {
            name: 'BreadcrumbItem',
            label: 'Breadcrumb Item',
          },
          {
            name: 'BreadcrumbLink',
            label: 'Breadcrumb Link',
          },
        ],
      },

      {
        name: 'List',
        label: 'List',
        children: [
          {
            name: 'List',
            label: 'List',
            image: listImage,
          },
          {
            name: 'ListItem',
            label: 'List Item',
          },
        ],
      },
      {
        name: 'Accordion',
        label: 'Accordion',
        children: [
          {
            name: 'Accordion',
            label: 'Accordion',
            image: accordionImage,
          },
          {
            name: 'AccordionIcon',
            label: 'Accordion Icon',
          },
          {
            name: 'AccordionItem',
            label: 'Accordion Item',
          },
          {
            name: 'AccordionButton',
            label: 'Accordion Button',
          },
          {
            name: 'AccordionPanel',
            label: 'Accordion Panel',
          },
        ],
      },
    ],
  },

  FormElements: {
    name: 'Form Elements',
    components: [
      {
        name: 'Checkbox',
        label: 'Check Box',
        image: checkboxImage,
      },
      {
        name: 'Radio',
        label: 'Radio Button',
        image: radioButtonImage,
      },
      {
        name: 'Input',
        label: 'Input',
        image: inputImage,
      },
      {
        name: 'Textarea',
        label: 'Text Area',
        image: textAreaImage,
      },
      {
        name: 'Select',
        label: 'Select',
        image: selectImage,
      },
      {
        name: 'NumberInput',
        label: 'Number Input',
        image: numberInputImage,
      },
      {
        name: 'FormControl',
        label: 'Form Control',
        children: [
          {
            name: 'FormControl',
            label: 'Form Control',
            image: FormControlImage,
          },
          {
            name: 'FormLabel',
            label: 'Form Label',
          },
          {
            name: 'FormHelperText',
            label: 'Form Helper Text',
          },
        ],
      },
      {
        name: 'InputGroup',
        label: 'Input Group',
        children: [
          {
            name: 'InputGroup',
            label: 'Input Group',
            image: InputGroupImage,
          },
          {
            name: 'InputLeftAddon',
            label: 'Input Left Addon',
          },
          {
            name: 'InputRightAddon',
            label: 'Input Right Addon',
          },
          {
            name: 'InputLeftElement',
            label: 'Input Left Element',
          },
          {
            name: 'InputRightElement',
            label: 'Input Right Element',
          },
        ],
      },
    ],
  },
  Blog: {
    name: 'Blog',
    components: [
      {
        name: 'Blog1',
        label: 'Blog 1',
        image: blogImage1,
      },
      {
        name: 'Blog2',
        label: 'Blog 2',
        image: blogImage2,
      },
    ],
  },
  Pricing: {
    name: 'Pricing',
    components: [
      {
        name: 'Pricing1',
        label: 'Pricing 1',
        image: pricingImage1,
      },
    ],
  },
  ECommerce: {
    name: 'ECommerce',
    components: [
      {
        name: 'ECommerce1',
        label: 'ECommerce 1',
        image: eCommerceImage1,
      },
      {
        name: 'ECommerce2',
        label: 'ECommerce 2',
        image: eCommerceImage2,
      },
    ],
  },
  Team: {
    name: 'Team',
    components: [
      {
        name: 'Team1',
        label: 'Team 1',
        image: TeamImage1,
      },
    ],
  },
  Contact: {
    name: 'Contact',
    components: [
      {
        name: 'Contact1',
        label: 'Team 2',
        image: contactImage1,
      },
    ],
  },
}

export default menuItems
