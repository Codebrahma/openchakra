import React from 'react'
import { useSelector } from 'react-redux'

import ActionButton from './ActionButton'
import { SmallCloseIcon } from '@chakra-ui/icons'
import {
  getCustomComponents,
  getCustomComponentsProps,
  getSelectedComponent,
} from '../../core/selectors/components'
import getPropsThatUseCustomProp from '../../utils/getPropsThatUseCustomProp'
import babelQueries from '../../babel-queries/queries'
import {
  getAllComponentsCode,
  getAllPagesCode,
} from '../../core/selectors/code'
import useDispatch from '../../hooks/useDispatch'

const CustomPropDeletionButton: React.FC<{ customPropName: string }> = ({
  customPropName,
}) => {
  const component = useSelector(getSelectedComponent)
  const customComponents = useSelector(getCustomComponents)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const componentsCode = useSelector(getAllComponentsCode)
  const pagesCode = useSelector(getAllPagesCode)
  const dispatch = useDispatch()

  const babelCustomPropDeletionQueryHandler = () => {
    const customComponentType = component.type
    const propsUsingCustomProp = getPropsThatUseCustomProp(
      customPropName,
      customComponentType,
      customComponents,
      customComponentsProps,
    )

    const { updatedCode, updatedPagesCode } = babelQueries.deleteCustomProp(
      componentsCode[customComponentType],
      pagesCode,
      {
        customComponentName: customComponentType,
        customPropName: customPropName,
        propsUsingCustomProp,
      },
    )
    dispatch.code.setComponentsCode(updatedCode, customComponentType)
    dispatch.code.resetAllPagesCode(updatedPagesCode)
  }

  const customPropDeletionHandler = () => {
    dispatch.components.deleteCustomProp(customPropName)
    setTimeout(() => {
      babelCustomPropDeletionQueryHandler()
    }, 200)
  }
  return (
    <ActionButton
      label="delete Exposed prop"
      icon={<SmallCloseIcon />}
      onClick={customPropDeletionHandler}
    />
  )
}

export default CustomPropDeletionButton
