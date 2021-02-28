import React from 'react'
import { ComponentWithAs } from '@chakra-ui/core'
import type { IconType } from 'react-icons'
type faIcons = typeof import('react-icons/fa')
type mdIcons = typeof import('react-icons/md')
type aiIcons = typeof import('react-icons/ai')

type ckIcons = typeof import('@chakra-ui/icons')
//default is being infered by ts:
//due to https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports
//https://stackoverflow.com/questions/66404694/
type nonIconImports = 'default' | 'createIcon'
type chakraIcons = Exclude<keyof ckIcons, nonIconImports>

type keysImported = keyof faIcons | keyof mdIcons | keyof aiIcons | chakraIcons
type IconName = Exclude<keysImported, nonIconImports>
//todo need stricter typing for props
type ReactChakraIcon = IconType | ComponentWithAs<'svg', any>

//make key as default export from module export
//required for react lazy

const makeDefaultExport = <T>(
  promise: Promise<T>,
  key: Exclude<keyof T, nonIconImports>,
) => {
  return promise.then((module) => {
    return {
      default: module[key],
    }
  })
}

const isFaIcon = (name: IconName): name is keyof faIcons => {
  return name.substring(0, 2) === 'Fa'
}
const isMdIcon = (name: IconName): name is keyof mdIcons => {
  return name.substring(0, 2) === 'Md'
}
const isAiIcon = (name: IconName): name is keyof aiIcons => {
  return name.substring(0, 2) === 'Ai'
}
const isChakraIcon = (name: IconName): name is chakraIcons => {
  return !['Ai, Md, Fa'].includes(name.substring(0, 2))
}

const ReactIcon = (
  iconName: IconName,
): React.LazyExoticComponent<ReactChakraIcon> => {
  if (isFaIcon(iconName)) {
    return React.lazy(() => {
      return makeDefaultExport(import('react-icons/fa'), iconName)
    })
  }
  if (isMdIcon(iconName)) {
    return React.lazy(() => {
      return makeDefaultExport(import('react-icons/md'), iconName)
    })
  }
  if (isAiIcon(iconName)) {
    return React.lazy(() => {
      return makeDefaultExport(import('react-icons/ai'), iconName)
    })
  }
  if (isChakraIcon(iconName)) {
    return React.lazy(() => {
      return makeDefaultExport(import('@chakra-ui/icons'), iconName)
    })
  }
  //check if valid chakra icon and return , then else default icon
  return React.lazy(() => {
    return makeDefaultExport(import('react-icons/ai'), 'AiFillAlert')
  })
}

export default ReactIcon
