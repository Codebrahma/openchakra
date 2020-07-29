import { createModel } from '@rematch/core'

type Overlay = undefined | { rect: DOMRect; id: string; type: ComponentType }

export type AppState = {
  showLayout: boolean
  showCode: boolean
  inputTextFocused: boolean
  overlay: undefined | Overlay
  showFullScreen: boolean
}

const app = createModel({
  state: {
    showLayout: true,
    showCode: false,
    inputTextFocused: false,
    overlay: undefined,
    showFullScreen: false,
  } as AppState,
  reducers: {
    toggleBuilderMode(state: AppState): AppState {
      return {
        ...state,
        showLayout: !state.showLayout,
      }
    },
    toggleCodePanel(state: AppState): AppState {
      return {
        ...state,
        showCode: !state.showCode,
      }
    },
    toggleInputText(state: AppState): AppState {
      return {
        ...state,
        inputTextFocused: !state.inputTextFocused,
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
