// @ts-nocheck
import React from 'react'
import * as fontAwesomeIcons from 'react-icons/fa'
import * as antDesignIcons from 'react-icons/ai'
import * as materialDesignIcons from 'react-icons/md'
import * as chakraIcons from '@chakra-ui/icons'

export const getFirstTwoCharacters = (value: string) => value.substring(0, 2)

// This function will find the type of icon and return the icon based on the type.
const findIconType = (iconValue: string) => {
  const subValue = getFirstTwoCharacters(iconValue)

  switch (subValue) {
    case 'Fa': {
      return fontAwesomeIcons[iconValue]
    }
    case 'Md': {
      return materialDesignIcons[iconValue]
    }
    case 'Ai': {
      return antDesignIcons[iconValue]
    }
    default: {
      return chakraIcons[iconValue]
    }
  }
}

const stringToIconConvertor = (propName: string, propValue: string) => {
  let Icon: any

  Icon = findIconType(propValue)

  //convert to icon element
  if (propName !== 'as') {
    if (Icon !== undefined) Icon = React.createElement(Icon)
    else Icon = ''
  }
  return Icon
}

export default stringToIconConvertor
