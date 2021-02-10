import React, { useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { CheckIcon } from '@chakra-ui/icons'
import { GoCode } from 'react-icons/go'

import {
  getSelectedComponentId,
  isChildrenOfCustomComponent,
  getCustomComponents,
} from '../../core/selectors/components'
import useClipboard from '../../hooks/useClipboard'
import ActionButton from './ActionButton'
import babelQueries from '../../babel-queries/queries'
import { getCode, getAllComponentsCode } from '../../core/selectors/code'
import { searchRootCustomComponent } from '../../utils/recursive'

const CodeActionButton = memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const { onCopy, hasCopied } = useClipboard()
  const componentId = useSelector(getSelectedComponentId)
  const customComponents = useSelector(getCustomComponents)
  const pageCode = useSelector(getCode)
  const isCustomComponentChild = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const componentsCode = useSelector(getAllComponentsCode)

  let rootParentOfParentElement: string = ``

  if (isCustomComponentChild) {
    rootParentOfParentElement = searchRootCustomComponent(
      customComponents[componentId],
      customComponents,
    )
  }
  const code = isCustomComponentChild
    ? componentsCode[rootParentOfParentElement]
    : pageCode

  const clickHandler = () => {
    setIsLoading(true)
    const componentCode = babelQueries.getComponent(code, { componentId })
    const componentCodeWithoutCompId = babelQueries.removeComponentId(
      componentCode,
    )
    onCopy(componentCodeWithoutCompId)
    setIsLoading(false)
  }

  return (
    <ActionButton
      isLoading={isLoading}
      label="Copy code component"
      colorScheme={hasCopied ? 'green' : 'gray'}
      onClick={clickHandler}
      icon={hasCopied ? <CheckIcon /> : <GoCode />}
    />
  )
})

export default CodeActionButton
