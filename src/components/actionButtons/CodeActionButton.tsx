import React, { useState, memo } from 'react'
import { useSelector } from 'react-redux'

import {
  getSelectedComponent,
  getProps,
  getComponents,
} from '../../core/selectors/components'
import { generateComponentCode } from '../../utils/codeGeneration/code'
import useClipboard from '../../hooks/useClipboard'
import ActionButton from './ActionButton'
import { CheckIcon } from '@chakra-ui/icons'
import { GoCode } from 'react-icons/go'

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

export default CodeActionButton
