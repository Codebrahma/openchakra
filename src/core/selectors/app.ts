import { RootState } from '../store'

export const getShowLayout = (state: RootState) => state.app.showLayout

export const getShowCode = (state: RootState) => state.app.showCode

export const getFocusedComponent = (id: IComponent['id']) => (
  state: RootState,
) => state.app.inputTextFocused && state.components.present.selectedId === id

export const getInputTextFocused = (state: RootState) =>
  state.app.inputTextFocused

export const getShowFullScreen = (state: RootState) => state.app.showFullScreen

export const getCustomTheme = (state: RootState) => state.app.customTheme

export const getLoadedFonts = (state: RootState) => state.app.loadedFonts

export const getSelectedIndex = (state: RootState) => {
  return {
    start: state.app.selectedStartIndex,
    end: state.app.selectedEndIndex,
  }
}
