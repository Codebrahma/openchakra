import buttonImage from '../../images/components-image/Button.png'
import badgeImage from '../../images/components-image/badge.png'
import inputImage from '../../images/components-image/input.png'
import textAreaImage from '../../images/components-image/textArea.png'
import checkboxImage from '../../images/components-image/checkbox.png'
import radioButtonImage from '../../images/components-image/radioButton.png'
import Image from '../../images/components-image/image.png'
import avatarImage from '../../images/components-image/avatar.png'

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

const normalComponents: IMenuItems = {
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
        name: 'CheckBox',
        image: checkboxImage,
      },
      {
        name: 'RadioButton',
        image: radioButtonImage,
      },
      {
        name: 'FormControl',
        isMeta: true,
      },
    ],
  },
}

export default normalComponents
