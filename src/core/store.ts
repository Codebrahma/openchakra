import { init } from '@rematch/core'
import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ComponentsStateWithUndo } from './models/components/components-types'
import { AppState } from './models/app'
import models from './models'
import filterUndoableActions from '../utils/undo'
import { TextState } from './models/text'
import { CodeState } from './models/code'

export type RootState = {
  app: AppState
  components: ComponentsStateWithUndo
  text: TextState
  code: CodeState
}

const version = parseInt(process.env.REACT_APP_VERSION || '1', 10)

const persistConfig = {
  key: `composer_v${version}`,
  storage,
  whitelist: ['present'],
  version,
  throttle: 500,
}
const persistThemeConfig = {
  key: `composer_customTheme_v${version}`,
  storage,
  whitelist: ['customTheme', 'loadedFonts'],
  version,
  throttle: 500,
}

const persistCodeConfig = {
  key: `composer_code_v${version}`,
  storage,
  whitelist: ['code'],
  version,
  throttle: 500,
}

const persistPlugin = {
  onStoreCreated(store: any) {
    persistStore(store)
  },
}

export const storeConfig = {
  models,
  redux: {
    // @ts-ignore
    combineReducers: reducers => {
      return combineReducers({
        app: persistReducer(persistThemeConfig, reducers.app),
        components: persistReducer(
          persistConfig,
          undoable(reducers.components, {
            limit: 10,
            filter: filterUndoableActions,
          }),
        ),
        text: reducers.text,
        code: persistReducer(persistCodeConfig, reducers.code),
      })
    },
  },
  plugins: [persistPlugin],
}

// @ts-ignore
export const store = init(storeConfig)
