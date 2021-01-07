import React from 'react'
import ActionButton from './ActionButton'
import { AddIcon } from '@chakra-ui/icons'

import { generateComponentId } from '../../utils/generateId'
import useDispatch from '../../hooks/useDispatch'
import { getExposedProps } from '../../utils/getExposedProps'
import { menuItems } from '../sidebar/componentsMenu'
import { useSelector } from 'react-redux'
import {
  getComponents,
  getProps,
  getCustomComponentsList,
  getSelectedPage,
} from '../../core/selectors/components'
import babelQueries from '../../babel-queries/queries'
import { getCode } from '../../core/selectors/code'
import { useToast } from '@chakra-ui/core'

const SaveComponentButton: React.FC<{ componentId: string }> = ({
  componentId,
}) => {
  const dispatch = useDispatch()
  const toast = useToast()
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
    const name = prompt('Enter the name for the Component')
    if (name && name.length > 1) {
      let editedName = name.split(' ').join('')
      editedName = editedName.charAt(0).toUpperCase() + editedName.slice(1)

      //check if the name already exist
      if (
        customComponentsList.indexOf(editedName) !== -1 ||
        Object.keys(menuItems).indexOf(editedName) !== -1
      )
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

        dispatch.components.saveComponent(editedName, newComponentId)
        setTimeout(() => {
          babelSaveQueryHandler(editedName, newComponentId)
        }, 200)
        toast({
          title: 'Component is saved successfully.',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top',
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
