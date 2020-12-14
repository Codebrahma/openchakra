import React, { memo } from 'react'
import { Box, Text } from '@chakra-ui/core'
import * as chakraComponent from '@chakra-ui/core'
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import ComponentPreview from './ComponentPreview'
import { useDropComponent } from '../../hooks/useDropComponent'
import { useSelector } from 'react-redux'
import useDispatch from '../../hooks/useDispatch'
import {
  getChildrenBy,
  getPropsBy,
  getShowCustomComponentPage,
} from '../../core/selectors/components'
import { getShowLayout, getShowFullScreen } from '../../core/selectors/app'
import generatePropsKeyValue from '../../utils/generatePropsKeyValue'
import { getCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'

export const gridStyles = {
  backgroundImage:
    'linear-gradient(0deg, transparent, transparent 7px, #E6E6FF 7px), linear-gradient(90deg, transparent, transparent 7px, #E6E6FF 7px);',
  backgroundSize: '8px 8px',
}

const Editor: React.FC = () => {
  const isBuilderMode = useSelector(getShowLayout)
  const dispatch = useDispatch()

  const { drop } = useDropComponent('root')
  const children = useSelector(getChildrenBy('root'))
  const isEmpty = !children.length
  const rootProps = useSelector(getPropsBy('root'))
  const isComponentsCreationPage = useSelector(getShowCustomComponentPage)
  const showFullScreen = useSelector(getShowFullScreen)

  const scope = { ...chakraComponent, React }
  const code = useSelector(getCode)

  // React-live does not support import statements
  const codeWithoutImports = babelQueries.removeImports(code)

  const onSelectBackground = () => {
    dispatch.components.unselect()
  }
  let editorBackgroundProps = {
    height: '100%',
    minWidth: '10rem',
    width: '100%',
    display: isEmpty ? 'flex' : 'block',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
    position: 'relative',
    flexDirection: 'column',
    onClick: onSelectBackground,
    ...generatePropsKeyValue(rootProps),
  }

  const EditorPreview = (
    <Box ref={drop} {...editorBackgroundProps} {...gridStyles}>
      {isEmpty && (
        <Text maxWidth="md" color="gray.400" fontSize="xl" textAlign="center">
          {isComponentsCreationPage
            ? 'This page allows you to create custom components.'
            : 'Drag and drop components to start building websites with zero coding.'}
        </Text>
      )}

      {children.map((name: string) => (
        <ComponentPreview key={name} componentName={name} />
      ))}
    </Box>
  )

  const OnlyPreview = (
    <Box {...editorBackgroundProps}>
      <LiveProvider
        code={codeWithoutImports + `\n render(<App />)`}
        scope={scope}
        noInline={true}
      >
        <LivePreview />
        <LiveError />
      </LiveProvider>
    </Box>
  )

  return (
    <Box height={!showFullScreen ? 'calc(100vh - 3rem)' : '100vh'}>
      {isBuilderMode ? EditorPreview : OnlyPreview}
    </Box>
  )
}

export default memo(Editor)
