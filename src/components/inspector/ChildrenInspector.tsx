import React from 'react'
import { useSelector } from 'react-redux'
import {
  getSelectedComponentChildren,
  getSelectedComponentId,
} from '../../core/selectors/components'
import ElementsList from './elements-list/ElementsList'
import useDispatch from '../../hooks/useDispatch'
import { getCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'

const ChildrenInspector = () => {
  const childrenComponent = useSelector(getSelectedComponentChildren)
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const code = useSelector(getCode)

  const moveChildren = (fromIndex: number, toIndex: number) => {
    dispatch.components.moveSelectedComponentChildren({
      componentId,
      fromIndex,
      toIndex,
    })
    const updatedCode = babelQueries.reorderComponentChildren(code, {
      componentId,
      fromIndex,
      toIndex,
    })
    dispatch.code.setCode(updatedCode)
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
