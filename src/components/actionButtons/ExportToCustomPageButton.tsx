import React from 'react'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/core'
import useDispatch from '../../hooks/useDispatch'

import ActionButton from './ActionButton'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import babelQueries from '../../babel-queries/queries'
import buildComponentIds from '../../utils/componentIdsBuilder'
import {
  isChildrenOfCustomComponent,
  getCustomComponents,
  getComponents,
} from '../../core/selectors/components'
import { getCode, getPageCode } from '../../core/selectors/code'

const ExportToCustomPageButton: React.FC<{ componentId: string }> = ({
  componentId,
}) => {
  const dispatch = useDispatch()
  const toast = useToast()
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const customComponents = useSelector(getCustomComponents)
  const components = useSelector(getComponents())
  const code = useSelector(getCode)
  const customPageCode = useSelector(getPageCode('customPage'))

  const clickHandler = () => {
    const componentIds = buildComponentIds(
      componentId,
      isCustomComponentChild ? customComponents : components,
    )

    const updatedCode = babelQueries.exportToCustomComponentsPage(
      code,
      customPageCode,
      {
        componentId: componentId,
        componentIds: [...componentIds],
      },
    )

    dispatch.code.setPageCode(updatedCode, 'customPage')

    toast({
      title: 'Component is exported successfully.',
      status: 'success',
      duration: 1000,
      isClosable: true,
      position: 'top',
    })
  }
  return (
    <ActionButton
      label="Export to custom components page"
      onClick={clickHandler}
      icon={<ExternalLinkIcon />}
    />
  )
}

export default ExportToCustomPageButton
