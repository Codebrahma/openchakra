import React, { useState, memo, useEffect } from 'react'
import { Link, Box, Flex, useToast } from '@chakra-ui/core'
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
  getChildrenBy,
  getProps,
  getCustomComponents,
  getCustomComponentsProps,
} from '../../core/selectors/components'
import ActionButton from './ActionButton'
import { generateComponentCode } from '../../utils/code'
import useClipboard from '../../hooks/useClipboard'
import { useInspectorUpdate } from '../../contexts/inspector-context'
import CustomComponentsPropsPanel from './panels/CustomComponentsPropsPanel'
import { menuItems } from '../sidebar/componentsMenu'

const CodeActionButton = memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const { onCopy, hasCopied } = useClipboard()

  const selectedComponent = useSelector(getSelectedComponent)
  const components = useSelector(getComponents)
  const customComponents = useSelector(getCustomComponents)
  const props = useSelector(getProps)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const parentId = selectedComponent.parent
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(parentId),
  )

  return (
    <ActionButton
      isLoading={isLoading}
      label="Copy code component"
      variantColor={hasCopied ? 'green' : 'gray'}
      onClick={async () => {
        setIsLoading(true)
        const code = isCustomComponentChild
          ? await generateComponentCode(
              {
                ...customComponents[parentId],
                children: [selectedComponent.id],
              },
              customComponents,
              customComponentsProps,
            )
          : await generateComponentCode(
              { ...components[parentId], children: [selectedComponent.id] },
              components,
              props,
            )
        onCopy(code)
        setIsLoading(false)
      }}
      icon={hasCopied ? 'check' : GoCode}
    />
  )
})

const Inspector = () => {
  const dispatch = useDispatch()
  const component = useSelector(getSelectedComponent)
  const toast = useToast()

  const { clearActiveProps } = useInspectorUpdate()

  const { type, id } = component
  const children = useSelector(getChildrenBy(id))
  const customComponentsList = useSelector(getCustomComponentsList)

  const isCustomComponent =
    customComponentsList && customComponentsList.indexOf(type) !== -1

  const isCustomComponentsPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(isChildrenOfCustomComponent(id))
  const enableSaveIcon =
    isCustomComponentsPage && !isCustomComponentChild && !isCustomComponent

  const isRoot = id === 'root'
  const parentIsRoot = component.parent === 'root'

  const docType = type
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
          color="black"
          py={2}
          px={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid #9FB3C8"
        >
          {isRoot ? 'Document' : type}
        </Box>
        {!isRoot && (
          <Flex
            py={2}
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
                    let editedName = name.split(' ').join('')
                    editedName =
                      editedName.charAt(0).toUpperCase() + editedName.slice(1)

                    //check if the name already exist
                    if (
                      customComponentsList.indexOf(editedName) !== -1 ||
                      Object.keys(menuItems).indexOf(editedName) !== -1
                    )
                      toast({
                        title: 'Duplicate type',
                        description:
                          'A component already exists with the same name.',
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top',
                      })
                    else {
                      dispatch.components.saveComponent(editedName)
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
              label="Remove"
              onClick={() => dispatch.components.deleteComponent(component.id)}
              icon={FiTrash2}
            />
          </Flex>
        )}
      </Box>
      {!isCustomComponent ? (
        <Box>
          <Box bg="white" px={3}>
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
