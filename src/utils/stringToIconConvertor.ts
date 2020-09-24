import React from 'react'
import * as chakraIcons from '@chakra-ui/icons'

const stringToIconConvertor = (propName: string, propValue: string) => {
  let Icon: any

  // Convert to chakra-ui icon function
  const value = propValue.toString()
  // @ts-ignore
  Icon = chakraIcons[value]

  //convert to icon element
  if (propName !== 'as') {
    if (Icon !== undefined) Icon = React.createElement(Icon)
    else Icon = ''
  }
  return Icon
}

export default stringToIconConvertor
