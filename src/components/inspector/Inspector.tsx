import React, { useState, memo, useEffect } from 'react'
import { Link, Box, Stack } from '@chakra-ui/core'
import Panels from './panels/Panels'
import { GoRepo, GoCode } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdRefresh } from 'react-icons/io'
import { useSelector } from 'react-redux'
import useDispatch from '../../hooks/useDispatch'
import StylesPanel from './panels/StylesPanel'
import {
  getSelectedComponent,
  getComponents,
  getCustomComponentsList,
  getShowCustomComponentPage,
} from '../../core/selectors/components'
import ActionButton from './ActionButton'
import { generateComponentCode } from '../../utils/code'
import useClipboard from '../../hooks/useClipboard'
import { useInspectorUpdate } from '../../contexts/inspector-context'
import CustomComponentsPropsPanel from './panels/CustomComponentsPropsPanel'

const CodeActionButton = memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const { onCopy, hasCopied } = useClipboard()

  const selectedComponent = useSelector(getSelectedComponent)
  const components = useSelector(getComponents)
  const parentId = selectedComponent.parent

  const parent = { ...components[parentId] }
  // Do not copy sibling components from parent
  parent.children = [selectedComponent.id]

  return (
    <ActionButton
      isLoading={isLoading}
      label="Copy code component"
      variantColor={hasCopied ? 'green' : 'gray'}
      onClick={async () => {
        setIsLoading(true)
        const code = await generateComponentCode(parent, components)
        onCopy(code)
        setIsLoading(false)
      }}
      icon={hasCopied ? 'check' : GoCode}
    />
  )
})

const Inspector = () => {
  const dispatch = useDispatch()
  let component = useSelector(getSelectedComponent)

  const { clearActiveProps } = useInspectorUpdate()

  const { type, rootParentType, id, children } = component
  const customComponentsList = useSelector(getCustomComponentsList)

  const isCustomComponent =
    customComponentsList && customComponentsList.indexOf(type) !== -1

  const isCustomComponentsPage = useSelector(getShowCustomComponentPage)

  const isRoot = id === 'root'
  const parentIsRoot = component.parent === 'root'

  const docType = rootParentType || type
  const componentHasChildren = children.length > 0

  useEffect(() => {
    clearActiveProps()
  }, [clearActiveProps])

  return (
    <>
      <Box bg="white">
        <Box
          fontWeight="semibold"
          fontSize="md"
          color="yellow.900"
          py={2}
          px={2}
          shadow="sm"
          bg="yellow.100"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {isRoot ? 'Document' : type}
        </Box>
        {!isRoot && (
          <Stack
            isInline
            py={2}
            spacing={4}
            align="center"
            zIndex={99}
            px={2}
            flexWrap="wrap"
            justify="flex-end"
          >
            <CodeActionButton />
            {isCustomComponentsPage ? (
              <ActionButton
                label="Save component"
                onClick={() => {
                  const name = prompt('Enter the name for the Component')
                  if (name && name.length > 1)
                    dispatch.components.saveComponent(name)
                }}
                icon="add"
              />
            ) : null}
            <ActionButton
              label="Duplicate"
              onClick={() => dispatch.components.duplicate()}
              icon="copy"
            />
            <ActionButton
              label="Reset props"
              icon={IoMdRefresh}
              onClick={() => dispatch.components.resetProps(component.id)}
            />
            <ActionButton
              label="Chakra UI Doc"
              as={Link}
              onClick={() => {
                window.open(
                  `https://chakra-ui.com/${docType.toLowerCase()}`,
                  '_blank',
                )
              }}
              icon={GoRepo}
            />
            <ActionButton
              bg="red.500"
              label="Remove"
              onClick={() => dispatch.components.deleteComponent(component.id)}
              icon={FiTrash2}
            />
          </Stack>
        )}
      </Box>
      {!isCustomComponent ? (
        <Box>
          <Box pb={1} bg="white" px={3}>
            <Panels component={component} isRoot={isRoot} />
          </Box>
          <StylesPanel
            isRoot={isRoot}
            showChildren={componentHasChildren}
            parentIsRoot={parentIsRoot}
          />{' '}
        </Box>
      ) : (
        <CustomComponentsPropsPanel />
      )}
    </>
  )
}

export default Inspector
