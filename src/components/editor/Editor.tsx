import React, { memo } from 'react'
import { Box, Text } from '@chakra-ui/core'
import ComponentPreview from './ComponentPreview'
import { useDropComponent } from '../../hooks/useDropComponent'
import SplitPane from 'react-split-pane'
import CodePanel from '../CodePanel'
import { useSelector } from 'react-redux'
import useDispatch from '../../hooks/useDispatch'
import { getChildrenBy, getPropsBy } from '../../core/selectors/components'
import { getShowLayout, getShowCode } from '../../core/selectors/app'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'

export const gridStyles = {
  backgroundImage:
    'linear-gradient(0deg, transparent, transparent 7px, #E6E6FF 7px), linear-gradient(90deg, transparent, transparent 7px, #E6E6FF 7px);',
  backgroundSize: '8px 8px',
  bg: 'white',
}

const Editor: React.FC = () => {
  const showCode = useSelector(getShowCode)
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
    ...generatePropsKeyValue(rootProps),
  }

  const Playground = (
    <Box
      {...editorBackgroundProps}
      height="100%"
      minWidth="10rem"
      width="100%"
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

  if (!showCode) {
    return Playground
  }

  return (
    <SplitPane
      style={{ overflow: 'auto' }}
      defaultSize="50%"
      resizerStyle={{
        border: '3px solid rgba(1, 22, 39, 0.21)',
        zIndex: 20,
        cursor: 'row-resize',
      }}
      split="horizontal"
    >
      {Playground}
      <CodePanel />
    </SplitPane>
  )
}

export default memo(Editor)
