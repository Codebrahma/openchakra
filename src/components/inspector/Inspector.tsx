import React, { useState, memo, useEffect } from 'react'
import { Link, Box, Stack, useToast } from '@chakra-ui/core'
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
  isChildrenOfCustomComponent,
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
  const toast = useToast()

  const { clearActiveProps } = useInspectorUpdate()

  const { type, rootParentType, id, children } = component
  const customComponentsList = useSelector(getCustomComponentsList)

  const isCustomComponent =
    customComponentsList && customComponentsList.indexOf(type) !== -1

  const isCustomComponentsPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(isChildrenOfCustomComponent(id))
  const enableSaveIcon =
    isCustomComponentsPage && !isCustomComponentChild && !isCustomComponent

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
            {enableSaveIcon ? (
              <ActionButton
                label="Save component"
                onClick={() => {
                  const name = prompt('Enter the name for the Component')
                  if (name && name.length > 1) {
                    //check if the name already exist
                    if (
                      customComponentsList.indexOf(
                        name.charAt(0).toUpperCase() + name.slice(1),
                      ) !== -1
                    )
                      toast({
                        title: 'Duplicate type',
                        description:
                          'An custom component already exists with the same name.',
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top',
                      })
                    else {
                      dispatch.components.saveComponent(name)
                      toast({
                        title: 'Component is saved successfully.',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                        position: 'top',
                      })
                    }
                  }
                }}
                icon="add"
              />
            ) : null}
            {!isCustomComponentsPage ? (
              <ActionButton
                label="Export to custom components page"
                onClick={() => {
                  dispatch.components.exportSelectedComponentToCustomPage()
                  toast({
                    title: 'Component is exported successfully.',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top',
                  })
                }}
                icon="external-link"
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
