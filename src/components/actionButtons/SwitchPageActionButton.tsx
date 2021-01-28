import React from 'react'
import ActionButton from './ActionButton'
import { MdCreateNewFolder } from 'react-icons/md'
import useDispatch from '../../hooks/useDispatch'
import { useSelector } from 'react-redux'
import { getAllPagesCode } from '../../core/selectors/code'
import babelQueries from '../../babel-queries/queries'
import { checkIsCustomPage } from '../../core/selectors/page'
import { Link } from 'react-router-dom'

const SwitchPageActionButton = () => {
  const dispatch = useDispatch()
  const isCustomPage = useSelector(checkIsCustomPage)
  const allPagesCode = useSelector(getAllPagesCode)

  const clickHandler = () => {
    dispatch.components.unselect()
    if (isCustomPage) {
      dispatch.page.switchPage('app')
      const componentsState = babelQueries.getComponentsState(
        allPagesCode['app'],
      )

      dispatch.components.resetComponentsState(componentsState)
    } else {
      dispatch.page.switchPage('customPage')
      const componentsState = babelQueries.getComponentsState(
        allPagesCode['customPage'],
      )

      dispatch.components.resetComponentsState(componentsState)
    }
  }
  return (
    <Link to={isCustomPage ? '/app' : '/customPage'}>
      <ActionButton
        label="Create components"
        icon={<MdCreateNewFolder />}
        onClick={clickHandler}
        bg={isCustomPage ? 'primary.100' : 'white'}
        color={isCustomPage ? 'primary.900' : 'black'}
        size="sm"
      />
    </Link>
  )
}

export default SwitchPageActionButton
