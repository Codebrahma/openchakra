import React, { useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/core'
import Panels from './panels/Panels'
import { GoRepo } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdRefresh } from 'react-icons/io'
import { MdFormatClear } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { CopyIcon } from '@chakra-ui/icons'

import useDispatch from '../../hooks/useDispatch'
import StylesPanel from './panels/StylesPanel'
import {
  getSelectedComponent,
  getCustomComponentsList,
  isChildrenOfCustomComponent,
  getChildrenBy,
  getComponents,
  getCustomComponents,
} from '../../core/selectors/components'
import ActionButton from '../actionButtons/ActionButton'
import { useInspectorUpdate } from '../../contexts/inspector-context'
import CustomComponentsPropsPanel from './panels/CustomComponentsPropsPanel'

import babelQueries from '../../babel-queries/queries'
import { getCode, getAllComponentsCode } from '../../core/selectors/code'
import { searchRootCustomComponent } from '../../utils/recursive'
import buildComponentIds from '../../utils/componentIdsBuilder'
import ExportToCustomPageButton from '../actionButtons/ExportToCustomPageButton'
import SaveComponentButton from '../actionButtons/SaveComponentButton'
import CodeActionButton from '../actionButtons/CodeActionButton'
import SpanActionButton from '../actionButtons/SpanActionButton'
import { checkIsCustomPage, getSelectedPage } from '../../core/selectors/page'

const Inspector = () => {
  const dispatch = useDispatch()
  const component = useSelector(getSelectedComponent)
  const selectedPage = useSelector(getSelectedPage)

  const { clearActiveProps } = useInspectorUpdate()

  const { type, id } = component
  const children = useSelector(getChildrenBy(id))
  const customComponentsList = useSelector(getCustomComponentsList)
  const customComponents = useSelector(getCustomComponents)
  const components = useSelector(getComponents())

  const isCustomComponent =
    customComponentsList && customComponentsList.indexOf(type) !== -1

  const isCustomPage = useSelector(checkIsCustomPage)
  const isCustomComponentChild = useSelector(isChildrenOfCustomComponent(id))
  const code = useSelector(getCode)
  const componentsCode = useSelector(getAllComponentsCode)
  let rootCustomParent: string = ``

  if (isCustomComponentChild) {
    rootCustomParent = searchRootCustomComponent(
      customComponents[id],
      customComponents,
    )
  }

  const updateCode = (code: string) => {
    if (code.length > 0) {
      // update the code
      isCustomComponentChild
        ? dispatch.code.setComponentsCode(code, rootCustomParent)
        : dispatch.code.setPageCode(code, selectedPage)
    }
  }

  const enableSaveIcon = () => {
    if (!isCustomPage) return false

    if (isCustomComponentChild) return false

    if (customComponents[component.type]) return false

    return true
  }

  const isRoot = id === 'root'
  const parentIsRoot = component.parent === 'root'

  const docType = type
  const componentHasChildren = children.length > 0

  useEffect(() => {
    clearActiveProps()
  }, [clearActiveProps])

  const removeComponentHandler = () => {
    dispatch.components.deleteComponent(component.id)

    setTimeout(() => {
      const updatedCode = babelQueries.deleteComponent(
        isCustomComponentChild ? componentsCode[rootCustomParent] : code,
        {
          componentId: component.id,
        },
      )
      updateCode(updatedCode)
    }, 200)

    dispatch.components.unselect()
  }

  const duplicateComponentHandler = () => {
    const componentIds = buildComponentIds(
      component.id,
      isCustomComponentChild ? customComponents : components,
    )

    dispatch.components.duplicate([...componentIds])

    setTimeout(() => {
      const updatedCode = babelQueries.duplicateComponent(
        isCustomComponentChild ? componentsCode[rootCustomParent] : code,
        {
          componentId: component.id,
          componentIds: [...componentIds],
        },
      )

      updateCode(updatedCode)
    }, 200)
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
              <SaveComponentButton componentId={component.id} />
            ) : null}
            {component.type === 'Text' || component.type === 'Heading' ? (
              <SpanActionButton />
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
            {!isCustomPage ? (
              <ExportToCustomPageButton componentId={component.id} />
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
