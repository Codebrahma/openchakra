import React from 'react'
import { useSelector } from 'react-redux'

import ActionButton from './ActionButton'
import { FiRepeat } from 'react-icons/fi'
import useDispatch from '../../hooks/useDispatch'
import { searchRootCustomComponent } from '../../utils/recursive'
import {
  getAllComponentsCode,
  getAllPagesCode,
} from '../../core/selectors/code'
import {
  getSelectedComponentId,
  getCustomComponents,
  getSelectedPage,
} from '../../core/selectors/components'
import babelQueries from '../../babel-queries/queries'

const UnExposePropButton: React.FC<{ propToUnExpose: IProp }> = ({
  propToUnExpose,
}) => {
  const dispatch = useDispatch()
  const componentsCode = useSelector(getAllComponentsCode)
  const selectedComponentId = useSelector(getSelectedComponentId)
  const customComponents = useSelector(getCustomComponents)
  const pagesCode = useSelector(getAllPagesCode)
  const isChildOfCustomComponent = customComponents[selectedComponentId]
  const selectedPage = useSelector(getSelectedPage)

  const { name, value } = propToUnExpose

  // TODO : Needs to be modified after completing the span component plugin
  const propValue = Array.isArray(value) ? value[0] : value

  const unExposeBabelQueryHandler = () => {
    if (propToUnExpose) {
      let rootCustomParentElement: string = ''

      if (isChildOfCustomComponent)
        rootCustomParentElement = searchRootCustomComponent(
          customComponents[selectedComponentId],
          customComponents,
        )
      const options = {
        customComponentName: rootCustomParentElement,
        componentId: selectedComponentId,
        exposedPropName: propToUnExpose?.name,
        exposedPropValue: propValue,
        customPropName:
          propToUnExpose?.derivedFromPropName === null
            ? ''
            : propToUnExpose?.derivedFromPropName,
      }

      const code = isChildOfCustomComponent
        ? componentsCode[rootCustomParentElement]
        : pagesCode[selectedPage]

      const { updatedPagesCode, updatedCode } = babelQueries.unExposeProp(
        code,
        pagesCode,
        options,
      )

      if (isChildOfCustomComponent) {
        dispatch.code.setComponentsCode(updatedCode, rootCustomParentElement)
        dispatch.code.resetPagesCode(updatedPagesCode)
      } else {
        dispatch.code.setPageCode(updatedCode, selectedPage)
      }
    }
  }

  const unExposePropHandler = () => {
    dispatch.components.unexpose(name)
    setTimeout(() => {
      unExposeBabelQueryHandler()
    }, 200)
  }

  return (
    <ActionButton
      label="Unexpose"
      icon={<FiRepeat />}
      onClick={unExposePropHandler}
    />
  )
}

export default UnExposePropButton
