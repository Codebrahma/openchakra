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

type IMenuComponent = {
  name: string
  isMeta?: boolean
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
      },
      {
        name: 'Flex',
      },
      {
        name: 'Grid',
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
        isMeta: true,
        image: FormControlImage,
      },
      {
        name: 'InputGroup',
        isMeta: true,
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
        isMeta: true,
      },
      {
        name: 'Blog2',
        image: blogImage2,
        isMeta: true,
      },
    ],
  },
  Pricing: {
    name: 'Pricing',
    components: [
      {
        name: 'Pricing1',
        image: pricingImage1,
        isMeta: true,
      },
    ],
  },
  ECommerce: {
    name: 'ECommerce',
    components: [
      {
        name: 'ECommerce1',
        image: eCommerceImage1,
        isMeta: true,
      },
      {
        name: 'ECommerce2',
        image: eCommerceImage2,
        isMeta: true,
      },
    ],
  },
  Team: {
    name: 'Team',
    components: [
      {
        name: 'Team1',
        image: TeamImage1,
        isMeta: true,
      },
    ],
  },
}

export default menuItems
