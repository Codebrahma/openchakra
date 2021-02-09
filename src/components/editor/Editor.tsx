import React, { memo } from 'react'
import { Box, Text } from '@chakra-ui/core'
import ComponentPreview from './ComponentPreview'
import { useDropComponent } from '../../hooks/useDropComponent'
import { useSelector } from 'react-redux'
import useDispatch from '../../hooks/useDispatch'
import { getChildrenBy, getPropsBy } from '../../core/selectors/components'
import { getShowLayout } from '../../core/selectors/app'
import findAndReplaceExposedPropValue from '../../utils/findAndReplaceExposedPropValue'

export const gridStyles = {
  backgroundImage:
    'linear-gradient(0deg, transparent, transparent 7px, #E6E6FF 7px), linear-gradient(90deg, transparent, transparent 7px, #E6E6FF 7px);',
  backgroundSize: '8px 8px',
}

const Editor: React.FC = () => {
  const showLayout = useSelector(getShowLayout)
  const dispatch = useDispatch()

  const { drop } = useDropComponent('root')
  const children = useSelector(getChildrenBy('root'))
  const isEmpty = !children.length
  const rootProps = useSelector(getPropsBy('root'))

  let editorBackgroundProps = {}

  const onSelectBackground = () => {
    dispatch.components.unselect()
  }

  if (showLayout) {
    editorBackgroundProps = gridStyles
  }

  editorBackgroundProps = {
    ...editorBackgroundProps,
    ...findAndReplaceExposedPropValue(rootProps),
  }

  return (
    <Box
      bg="white"
      {...editorBackgroundProps}
      height="100%"
      minWidth="10rem"
      width="100%"
      pb={10}
      display={isEmpty ? 'flex' : 'block'}
      justifyContent="center"
      alignItems="center"
      overflow="auto"
      ref={drop}
      position="relative"
      flexDirection="column"
      onClick={onSelectBackground}
    >
      {isEmpty && (
        <Text maxWidth="md" color="gray.400" fontSize="xl" textAlign="center">
          Drag and drop components to start building websites with zero coding.
        </Text>
      )}

      {children.map((name: string) => (
        <ComponentPreview key={name} componentName={name} />
      ))}
    </Box>
  )
}

export default memo(Editor)
