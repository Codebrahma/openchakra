import React, { useState, memo, useEffect } from 'react'
import { Box, Flex, useToast } from '@chakra-ui/core'
import Panels from './panels/Panels'
import { GoRepo, GoCode } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdRefresh, IoMdBrush } from 'react-icons/io'
import { MdFormatClear } from 'react-icons/md'
import { useSelector } from 'react-redux'
import {
  ExternalLinkIcon,
  CheckIcon,
  AddIcon,
  CopyIcon,
} from '@chakra-ui/icons'

import useDispatch from '../../hooks/useDispatch'
import StylesPanel from './panels/StylesPanel'
import {
  getSelectedComponent,
  getCustomComponentsList,
  getShowCustomComponentPage,
  isChildrenOfCustomComponent,
  getChildrenBy,
  getProps,
  isSelectedRangeContainsTwoSpan,
  checkIsContainerComponent,
  getComponents,
  getSelectedPage,
} from '../../core/selectors/components'
import ActionButton from './ActionButton'
import { generateComponentCode } from '../../utils/codeGeneration/code'
import useClipboard from '../../hooks/useClipboard'
import { useInspectorUpdate } from '../../contexts/inspector-context'
import CustomComponentsPropsPanel from './panels/CustomComponentsPropsPanel'
import { menuItems } from '../sidebar/componentsMenu'
import {
  getIsContainsOnlySpan,
  getSelectedTextDetails,
  getIsSelectionEnabled,
} from '../../core/selectors/text'
import babelQueries from '../../babel-queries/queries'
import { getCode } from '../../core/selectors/code'

const CodeActionButton = memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const { onCopy, hasCopied } = useClipboard()
  const selectedComponent = useSelector(getSelectedComponent)
  const parentId = selectedComponent.parent
  const components = useSelector(getComponents(parentId))
  const props = useSelector(getProps(parentId))

  return (
    <ActionButton
      isLoading={isLoading}
      label="Copy code component"
      colorScheme={hasCopied ? 'green' : 'gray'}
      onClick={async () => {
        setIsLoading(true)
        const code = await generateComponentCode(
          { ...components[parentId], children: [selectedComponent.id] },
          components,
          props,
        )
        onCopy(code)
        setIsLoading(false)
      }}
      icon={hasCopied ? <CheckIcon /> : <GoCode />}
    />
  )
})

const Inspector = () => {
  const dispatch = useDispatch()
  const component = useSelector(getSelectedComponent)
  const toast = useToast()
  const selectedPage = useSelector(getSelectedPage)

  const { clearActiveProps } = useInspectorUpdate()

  const { type, id } = component
  const children = useSelector(getChildrenBy(id))
  const customComponentsList = useSelector(getCustomComponentsList)

  const isCustomComponent =
    customComponentsList && customComponentsList.indexOf(type) !== -1

  const isCustomComponentsPage = useSelector(getShowCustomComponentPage)
  const isCustomComponentChild = useSelector(isChildrenOfCustomComponent(id))
  const containsOnlySpan = useSelector(getIsContainsOnlySpan)
  const selectedTextDetails = useSelector(getSelectedTextDetails)

  const isSelectedTwoSpan = useSelector(
    isSelectedRangeContainsTwoSpan({
      start: selectedTextDetails.startNodePosition,
      end: selectedTextDetails.endNodePosition,
    }),
  )
  const isSelectionEnabled = useSelector(getIsSelectionEnabled)
  const isContainerComponent = useSelector(checkIsContainerComponent(id))
  const code = useSelector(getCode)

  // check if its a normal component or a container component
  const isNormalOrContainer = () => {
    if (!isCustomComponent) return true
    else if (isContainerComponent) return true
    else return false
  }

  const enableSaveIcon = () => {
    if (isCustomComponentsPage && !isCustomComponentChild) {
      if (isNormalOrContainer()) return true
    }
    return false
  }

  const isRoot = id === 'root'
  const parentIsRoot = component.parent === 'root'

  const docType = type
  const componentHasChildren = children.length > 0

  useEffect(() => {
    clearActiveProps()
  }, [clearActiveProps])

  const wrapSpanClickHandler = () => {
    if (isSelectedTwoSpan) {
      toast({
        title: 'Multiple span components',
        description: 'Multiple span components are selected.',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'top',
      })
    } else {
      if (containsOnlySpan) {
        dispatch.components.removeSpan(selectedTextDetails)
      } else {
        dispatch.components.addSpan(selectedTextDetails)
      }
      dispatch.text.removeSelection()
    }
  }

  const removeComponentHandler = () => {
    const updatedCode = babelQueries.deleteComponent(code, {
      componentId: component.id,
    })
    const componentsState = babelQueries.getComponentsState(updatedCode)
    dispatch.code.setCode(updatedCode, selectedPage)
    dispatch.components.updateComponentsState(componentsState)
    dispatch.components.unselect()
  }
  const duplicateComponentHandler = () => {
    dispatch.components.duplicate()
    const updatedCode = babelQueries.duplicateComponent(code, {
      componentId: component.id,
    })
    const componentsState = babelQueries.getComponentsState(updatedCode)
    dispatch.components.updateComponentsState(componentsState)
    dispatch.code.setCode(updatedCode, selectedPage)
  }

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
            {enableSaveIcon() ? (
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
                      const updatedCode = babelQueries.saveComponent(code, {
                        componentId: component.id,
                        customComponentName: editedName,
                      })
                      const componentsState = babelQueries.getComponentsState(
                        updatedCode,
                      )
                      dispatch.components.updateComponentsState(componentsState)
                      dispatch.code.setCode(updatedCode, selectedPage)
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
                icon={<AddIcon />}
              />
            ) : null}
            {component.type === 'Text' || component.type === 'Heading' ? (
              <ActionButton
                label={containsOnlySpan ? 'Remove Span' : 'Wrap with Span'}
                onClick={wrapSpanClickHandler}
                icon={<IoMdBrush />}
                color={containsOnlySpan ? 'primary.800' : 'black'}
                bg={containsOnlySpan ? 'primary.100' : 'white'}
                isDisabled={!isSelectionEnabled}
              />
            ) : null}
            {component.type === 'Text' && (
              <ActionButton
                label="Remove all formatting"
                onClick={(e: any) => {
                  dispatch.components.clearAllFormatting()
                }}
                icon={<MdFormatClear />}
              />
            )}
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
                icon={<ExternalLinkIcon />}
              />
            ) : null}

            <ActionButton
              label="Duplicate"
              onClick={duplicateComponentHandler}
              icon={<CopyIcon />}
            />
            <ActionButton
              label="Reset props"
              icon={<IoMdRefresh />}
              onClick={() => dispatch.components.resetProps(component.id)}
            />
            <ActionButton
              label="Chakra UI Doc"
              onClick={() => {
                window.open(
                  `https://chakra-ui.com/${docType.toLowerCase()}`,
                  '_blank',
                )
              }}
              icon={<GoRepo />}
            />
            <ActionButton
              label="Remove"
              onClick={removeComponentHandler}
              icon={<FiTrash2 />}
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
