import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, theme } from '@chakra-ui/core'
import { Provider } from 'react-redux'

import { store } from './core/store'
// import { ErrorBoundary as BugsnagErrorBoundary } from './utils/bugsnag'
import AppErrorBoundary from './components/errorBoundaries/AppErrorBoundary'

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      100: '#C4C6FF',
      200: '#A2A5FC',
      300: '#8888FC',
      400: '#5D55FA',
      500: '#5D55FA',
      600: '#4D3DF7',
      700: '#3525E6',
      800: '#1D0EBE',
      900: '#0C008C',
    },
    neutrals: {
      100: '#D9E2EC',
      200: '#BCCCDC',
      300: '#9FB3C8',
      400: '#829AB1',
      500: '#627D98',
      600: '#486581',
      700: '#334E68',
      800: '#243B53',
      900: '#102A43',
    },
  },
}

ReactDOM.render(
  // <BugsnagErrorBoundary>
  <ChakraProvider resetCSS theme={customTheme}>
    <AppErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </AppErrorBoundary>
  </ChakraProvider>,
  // </BugsnagErrorBoundary>,

  document.getElementById('root'),
)
