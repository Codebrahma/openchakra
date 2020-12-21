import useDispatch from './useDispatch'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import babelQueries from '../babel-queries/queries'
import { useSelector } from 'react-redux'
import { getCode } from '../core/selectors/code'
import {
  getSelectedComponentId,
  getSelectedPage,
} from '../core/selectors/components'

/**
 * @member
 * @name keyMap
 * @description This member includes all the keyboard shortcuts
 */
export const keyMap = {
  DELETE_NODE_DEL: 'del',
  DELETE_NODE_BACKSPACE: 'backspace',
  TOGGLE_BUILDER_MODE: 'b',
  TOGGLE_CODE_PANEL: 'c',
  UNDO: 'ctrl+z',
  CMD_UNDO: 'cmd+z',
  REDO: 'ctrl+y',
  CMD_REDO: 'cmd+shift+z',
  UNSELECT: 'Escape',
  DUPLICATE: 'ctrl+d',
  CMD_DUPLICATE: 'cmd+d',
  FULL_SCREEN: 'f',
}

const hasNoSpecialKeyPressed = (event: KeyboardEvent | undefined) =>
  !event?.metaKey && !event?.shiftKey && !event?.ctrlKey && !event?.altKey

const useShortcuts = () => {
  const dispatch = useDispatch()
  const code = useSelector(getCode)
  const selectedComponentId = useSelector(getSelectedComponentId)
  const selectedPage = useSelector(getSelectedPage)

  const deleteNode = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }
    dispatch.components.deleteComponent()
    const updatedCode = babelQueries.deleteComponent(code, {
      componentId: selectedComponentId,
    })
    dispatch.code.setPageCode(updatedCode, selectedPage)
  }

  const toggleBuilderMode = (event: KeyboardEvent | undefined) => {
    if (event && hasNoSpecialKeyPressed(event)) {
      event.preventDefault()
      dispatch.app.toggleBuilderMode()
    }
  }

  const toggleCodePanel = (event: KeyboardEvent | undefined) => {
    if (event && hasNoSpecialKeyPressed(event)) {
      event.preventDefault()
      dispatch.app.toggleCodePanel()
    }
  }

  const undo = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    dispatch(UndoActionCreators.undo())
  }

  const redo = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    dispatch(UndoActionCreators.redo())
  }

  const onUnselect = () => {
    dispatch.components.unselect()
  }

  const onDuplicate = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    dispatch.components.duplicate()
  }

  const fullScreen = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    dispatch.app.toggleFullScreen()
  }

  const handlers = {
    DELETE_NODE: deleteNode,
    TOGGLE_BUILDER_MODE: toggleBuilderMode,
    TOGGLE_CODE_PANEL: toggleCodePanel,
    UNDO: undo,
    REDO: redo,
    UNSELECT: onUnselect,
    DUPLICATE: onDuplicate,
    FULL_SCREEN: fullScreen,
  }

  return { handlers }
}

export default useShortcuts
