import { createModel } from '@rematch/core'

type Overlay = undefined | { rect: DOMRect; id: string; type: ComponentType }

export type AppState = {
  showLayout: boolean
  showCode: boolean
  inputTextFocused: boolean
  overlay: undefined | Overlay
  showFullScreen: boolean
  customTheme: null | any
  loadedFonts: null | Array<string>
}

const app = createModel({
  state: {
    showLayout: true,
    showCode: false,
    inputTextFocused: false,
    overlay: undefined,
    showFullScreen: false,
    customTheme: null,
    loadedFonts: null,
    selectedTextDetails: undefined,
  } as AppState,
  reducers: {
    toggleBuilderMode(state: AppState): AppState {
      return {
        ...state,
        showLayout: !state.showLayout,
      }
    },
    toggleCodePanel(state: AppState, showCode?: boolean): AppState {
      return {
        ...state,
        showCode: showCode || !state.showCode,
      }
    },
    toggleInputText(state: AppState, showInputText?: boolean): AppState {
      return {
        ...state,
        inputTextFocused: showInputText || !state.inputTextFocused,
      }
    },
    toggleFullScreen(state: AppState): AppState {
      return {
        ...state,
        showFullScreen: !state.showFullScreen,
      }
    },
    setOverlay(state: AppState, overlay: Overlay | undefined): AppState {
      return {
        ...state,
        overlay,
      }
    },
    setCustomTheme(state: AppState, text: any): AppState {
      return {
        ...state,
        customTheme: text,
      }
    },
    resetCustomTheme(state: AppState): AppState {
      return {
        ...state,
        customTheme: null,
      }
    },
    addFonts: (state: AppState, font: string): AppState => {
      return {
        ...state,
        loadedFonts: state.loadedFonts ? [...state.loadedFonts, font] : [font],
      }
    },
    removeFont: (state: AppState, fontToBeRemoved: string): AppState => {
      if (state.loadedFonts) {
        const newLoadedFonts = state.loadedFonts.filter(font => {
          if (fontToBeRemoved === font) return null
          return font
        })
        return {
          ...state,
          loadedFonts: newLoadedFonts.length === 0 ? null : newLoadedFonts,
        }
      }
      return state
    },
    'components/deleteComponent': (state: AppState): AppState => {
      return {
        ...state,
        overlay: undefined,
      }
    },
    '@@redux-undo/UNDO': (state: AppState): AppState => {
      return {
        ...state,
        overlay: undefined,
      }
    },
  },
})

export default app
