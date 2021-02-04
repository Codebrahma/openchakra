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

type IMenuComponent = {
  name: string
  image?: string
}

type IMenuItem = {
  name: string
  components: IMenuComponent[]
}

type IMenuItems = {
  [itemName: string]: IMenuItem
}

const menuItems: IMenuItems = {
  Containers: {
    name: 'Containers',
    components: [
      {
        name: 'Box',
        image: boxImage,
      },
      {
        name: 'Flex',
        image: flexImage,
      },
      {
        name: 'Grid',
        image: gridImage,
      },
      {
        name: 'AvatarGroup',
        image: avatarGroupImage,
      },
      {
        name: 'RadioGroup',
        image: radioGroupImage,
      },
      {
        name: 'AspectRatio',
        image: aspectRatioImage,
      },
    ],
  },
  Elements: {
    name: 'Elements',
    components: [
      {
        name: 'Button',
        image: buttonImage,
      },
      {
        name: 'Avatar',
        image: avatarImage,
      },
      {
        name: 'Badge',
        image: badgeImage,
      },
      {
        name: 'Image',
        image: Image,
      },
    ],
  },
  Typography: {
    name: 'Typography',
    components: [
      {
        name: 'Heading1',
        image: headingImage1,
      },
      {
        name: 'Heading2',
        image: headingImage2,
      },
      {
        name: 'Heading3',
        image: headingImage3,
      },
      {
        name: 'Heading4',
        image: headingImage4,
      },
      {
        name: 'Heading5',
        image: headingImage5,
      },
      {
        name: 'Heading6',
        image: headingImage6,
      },
      {
        name: 'Text',
        image: textImage,
      },
    ],
  },
  Form: {
    name: 'Form',
    components: [
      {
        name: 'Input',
        image: inputImage,
      },
      {
        name: 'Textarea',
        image: textAreaImage,
      },
      {
        name: 'Checkbox',
        image: checkboxImage,
      },
      {
        name: 'Radio',
        image: radioButtonImage,
      },
      {
        name: 'FormControl',
        image: FormControlImage,
      },
      {
        name: 'InputGroup',
        image: InputGroupImage,
      },
    ],
  },
  Blog: {
    name: 'Blog',
    components: [
      {
        name: 'Blog1',
        image: blogImage1,
      },
      {
        name: 'Blog2',
        image: blogImage2,
      },
    ],
  },
  Pricing: {
    name: 'Pricing',
    components: [
      {
        name: 'Pricing1',
        image: pricingImage1,
      },
    ],
  },
  ECommerce: {
    name: 'ECommerce',
    components: [
      {
        name: 'ECommerce1',
        image: eCommerceImage1,
      },
      {
        name: 'ECommerce2',
        image: eCommerceImage2,
      },
    ],
  },
  Team: {
    name: 'Team',
    components: [
      {
        name: 'Team1',
        image: TeamImage1,
      },
    ],
  },
}

export default menuItems
