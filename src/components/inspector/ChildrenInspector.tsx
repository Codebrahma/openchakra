import React from 'react'
import { useSelector } from 'react-redux'
import {
  getSelectedComponentChildren,
  getSelectedComponentId,
  getSelectedPage,
  getCustomComponents,
  isChildrenOfCustomComponent,
} from '../../core/selectors/components'
import ElementsList from './elements-list/ElementsList'
import useDispatch from '../../hooks/useDispatch'
import { getCode, getAllComponentsCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'
import { searchRootCustomComponent } from '../../utils/recursive'

const ChildrenInspector = () => {
  const childrenComponent = useSelector(getSelectedComponentChildren)
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const customComponents = useSelector(getCustomComponents)
  const isCustomComponentUpdate = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const componentsCode = useSelector(getAllComponentsCode)

  const moveChildren = (fromIndex: number, toIndex: number) => {
    const rootCustomParent = isCustomComponentUpdate
      ? searchRootCustomComponent(
          customComponents[componentId],
          customComponents,
        )
      : ''
    const updatedCode = babelQueries.reorderComponentChildren(
      isCustomComponentUpdate ? componentsCode[rootCustomParent] : code,
      {
        componentId,
        fromIndex,
        toIndex,
      },
    )
    if (updatedCode !== code) {
      const componentsState = babelQueries.getComponentsState(updatedCode)
      if (isCustomComponentUpdate) {
        dispatch.code.setComponentsCode(updatedCode, rootCustomParent)
        dispatch.components.updateCustomComponentsState(componentsState)
      } else {
        dispatch.components.updateComponentsState(componentsState)
        dispatch.code.setPageCode(updatedCode, selectedPage)
      }
    }
  }

  const onSelectChild = (id: IComponent['id']) => {
    dispatch.components.select(id)
  }

  const onHoverChild = (id: IComponent['id']) => {
    dispatch.components.hover(id)
  }

  const onUnhoverChild = () => {
    dispatch.components.unhover()
  }

  return (
    <ElementsList
      elements={childrenComponent}
      moveItem={moveChildren}
      onSelect={onSelectChild}
      onHover={onHoverChild}
      onUnhover={onUnhoverChild}
    />
  )
}

export default ChildrenInspector
