import uniq from 'lodash/uniq'
import { isPropRelatedToIcon } from '../../components/editor/PreviewContainer'
import { getFirstTwoCharacters } from '../stringToIconConvertor'

// This function is used to get icons from each different icon type
const getRequiredIconsToImport = (components: IComponents, props: IProps) => {
  const chakraIcons: string[] = []
  const fontAwesomeIcons: string[] = []
  const materialIcons: string[] = []
  const antIcons: string[] = []

  Object.keys(props.byComponentId).forEach(componentId => {
    props.byComponentId[componentId]
      .filter(propId =>
        isPropRelatedToIcon(
          components[componentId].type,
          props.byId[propId].name,
        ),
      )
      .forEach(propId => {
        const propValue = props.byId[propId].value
        const subValue = getFirstTwoCharacters(propValue)

        switch (subValue) {
          case 'Fa': {
            fontAwesomeIcons.push(propValue)
            break
          }
          case 'Md': {
            materialIcons.push(propValue)
            break
          }
          case 'Ai': {
            antIcons.push(propValue)
            break
          }
          default: {
            chakraIcons.push(propValue)
            break
          }
        }
      })
  })

  return {
    chakraIcons: uniq(chakraIcons),
    fontAwesomeIcons: uniq(fontAwesomeIcons),
    materialIcons: uniq(materialIcons),
    antIcons: uniq(antIcons),
  }
}

// This function will get the import format for all icons
const getImportFormatForIcons = (components: IComponents, props: IProps) => {
  const {
    chakraIcons,
    fontAwesomeIcons,
    materialIcons,
    antIcons,
  } = getRequiredIconsToImport(components, props)

  const chakraIconsImport =
    chakraIcons.length > 0
      ? `import {
    ${chakraIcons.join(',')}
  } from "@chakra-ui/icons";`
      : ''

  const fontAwesomeIconsImport =
    fontAwesomeIcons.length > 0
      ? `import {
      ${fontAwesomeIcons.join(',')}
    } from "react-icons/fa";`
      : ''
  const materialIconsImport =
    materialIcons.length > 0
      ? `import {
        ${materialIcons.join(',')}
      } from "react-icons/md";`
      : ''

  const antIconsImport =
    antIcons.length > 0
      ? `import {
          ${antIcons.join(',')}
        } from "react-icons/ai";`
      : ''
  return {
    chakraIconsImport,
    fontAwesomeIconsImport,
    materialIconsImport,
    antIconsImport,
  }
}

export default getImportFormatForIcons
