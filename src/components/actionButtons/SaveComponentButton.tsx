import React from 'react'
import ActionButton from './ActionButton'
import { AddIcon } from '@chakra-ui/icons'

import { generateComponentId } from '../../utils/generateId'
import useDispatch from '../../hooks/useDispatch'
import { getExposedProps } from '../../utils/getExposedProps'
import { useSelector } from 'react-redux'
import {
  getComponents,
  getProps,
  getCustomComponentsList,
} from '../../core/selectors/components'
import babelQueries from '../../babel-queries/queries'
import { getCode } from '../../core/selectors/code'
import { useToast } from '@chakra-ui/core'
import { getSelectedPage } from '../../core/selectors/page'
import isContainsOnlyAlphaNumeric from '../../utils/isContainsOnlyAlphaNumeric'
import { useQueue } from '../../hooks/useQueue'

const SaveComponentButton: React.FC<{ componentId: string }> = ({
  componentId,
}) => {
  const dispatch = useDispatch()
  const toast = useToast()
  const queue = useQueue()

  const components = useSelector(getComponents())
  const props = useSelector(getProps())
  const code = useSelector(getCode)
  const customComponentsList = useSelector(getCustomComponentsList)
  const selectedPage = useSelector(getSelectedPage)

  const babelSaveQueryHandler = (
    customComponentName: string,
    newComponentId: string,
  ) => {
    const exposedProps = getExposedProps(componentId, components, props)
    const { updatedCode, customComponentCode } = babelQueries.saveComponent(
      code,
      {
        componentId,
        componentInstanceId: newComponentId,
        customComponentName,
        exposedProps,
      },
    )
    dispatch.code.setPageCode(updatedCode, selectedPage)
    dispatch.code.setComponentsCode(customComponentCode, customComponentName)
  }

  const saveComponentHandler = () => {
    const name = prompt('Enter the name for the Component') || ''
    if (name.length > 1) {
      if (!isContainsOnlyAlphaNumeric(name)) {
        toast({
          title: 'Invalid name format',
          description: 'The component name can have letters and numbers only.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
        return
      }
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

      //check if the name already exist
      if (customComponentsList.indexOf(formattedName) !== -1)
        toast({
          title: 'Duplicate type',
          description: 'A component already exists with the same name.',
          status: 'error',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })
      else {
        const newComponentId = generateComponentId()

        dispatch.components.saveComponent(formattedName, newComponentId)
        toast({
          title: 'Component is saved successfully.',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top',
        })

        queue.enqueue(async () => {
          babelSaveQueryHandler(formattedName, newComponentId)
        })
      }
    }
  }
  return (
    <ActionButton
      label="Save component"
      onClick={saveComponentHandler}
      icon={<AddIcon />}
    />
  )
}

export default SaveComponentButton
