import { useHotkeys } from 'react-hotkeys-hook'
import useShortcuts, { keyMap } from './useShortcuts'

const useShortCutKeys = () => {
  const { handlers } = useShortcuts()

  useHotkeys(keyMap.TOGGLE_BUILDER_MODE, handlers.TOGGLE_BUILDER_MODE)
  useHotkeys(keyMap.REDO, handlers.REDO)
  useHotkeys(keyMap.UNDO, handlers.UNDO)
  useHotkeys(keyMap.CMD_REDO, handlers.REDO)
  useHotkeys(keyMap.CMD_UNDO, handlers.UNDO)
  useHotkeys(keyMap.DELETE_NODE, handlers.DELETE_NODE)
  useHotkeys(keyMap.TOGGLE_CODE_PANEL, handlers.TOGGLE_CODE_PANEL)
  useHotkeys(keyMap.UNSELECT, handlers.UNSELECT)
  useHotkeys(keyMap.FULL_SCREEN, handlers.FULL_SCREEN)
  useHotkeys(keyMap.DUPLICATE, handlers.DUPLICATE)
  useHotkeys(keyMap.CMD_DUPLICATE, handlers.DUPLICATE)
}

export default useShortCutKeys
