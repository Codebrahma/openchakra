import React from 'react'
import ActionButton from './ActionButton'
import { MdCreateNewFolder } from 'react-icons/md'
import useDispatch from '../../hooks/useDispatch'
import { useSelector } from 'react-redux'
import { getAllPagesCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'
import { checkIsCustomPage } from '../../core/selectors/page'

const SwitchPageActionButton = () => {
  const dispatch = useDispatch()
  const showCustomPage = useSelector(checkIsCustomPage)
  const allPagesCode = useSelector(getAllPagesCode)

  const clickHandler = () => {
    dispatch.components.unselect()
    if (showCustomPage) {
      dispatch.page.switchPage('app')
      const componentsState = babelQueries.getComponentsState(
        allPagesCode['app'],
      )
      dispatch.components.updateComponentsState(componentsState)
    } else {
      dispatch.page.switchPage('customPage')
      const componentsState = babelQueries.getComponentsState(
        allPagesCode['customPage'],
      )
      dispatch.components.updateComponentsState(componentsState)
    }
  }
  return (
    <ActionButton
      label="Create components"
      icon={<MdCreateNewFolder />}
      onClick={clickHandler}
      bg={showCustomPage ? 'primary.100' : 'white'}
      color={showCustomPage ? 'primary.900' : 'black'}
      size="sm"
    />
  )
}

export default SwitchPageActionButton
