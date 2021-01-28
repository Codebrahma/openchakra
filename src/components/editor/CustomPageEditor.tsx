import React, { memo } from 'react'
import { Box } from '@chakra-ui/core'
import ComponentPreview from './ComponentPreview'
import { useSelector } from 'react-redux'
import useDispatch from '../../hooks/useDispatch'
import { getShowLayout } from '../../core/selectors/app'
import { getCustomComponentsProps } from '../../core/selectors/components'
import { getPropsOfCustomComponent } from '../../hooks/useDropComponent'
import { generateComponentId } from '../../utils/generateId'
import { useLocation } from 'react-router-dom'

export const gridStyles = {
  backgroundImage:
    'linear-gradient(0deg, transparent, transparent 7px, #E6E6FF 7px), linear-gradient(90deg, transparent, transparent 7px, #E6E6FF 7px);',
  backgroundSize: '8px 8px',
}

const CustomPageEditor: React.FC = () => {
  const showLayout = useSelector(getShowLayout)
  const dispatch = useDispatch()
  const url = new URLSearchParams(useLocation().search)

  const componentType: string = url.get('name') || ''

  const customComponentsProps = useSelector(getCustomComponentsProps)

  const defaultProps = getPropsOfCustomComponent(
    componentType,
    customComponentsProps,
  )

  const componentId = generateComponentId()

  dispatch.components.addCustomComponent({
    componentId,
    parentId: 'root',
    type: componentType,
    defaultProps,
  })

  let editorBackgroundProps = {}

  const onSelectBackground = () => {
    dispatch.components.unselect()
  }

  if (showLayout) {
    editorBackgroundProps = gridStyles
  }

  return (
    <Box
      bg="white"
      {...editorBackgroundProps}
      height="100%"
      minWidth="10rem"
      width="100%"
      justifyContent="center"
      alignItems="center"
      overflow="auto"
      position="relative"
      flexDirection="column"
      onClick={onSelectBackground}
    >
      <ComponentPreview key={componentId} componentName={componentId} />
    </Box>
  )
}

export default memo(CustomPageEditor)
