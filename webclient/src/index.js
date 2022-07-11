import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { defaultRebootTheme } from 'styled-reboot'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from './globalStyle'

import rootReducer from './Reducers'
import rootSaga from './Sagas'

import App from './App'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<ThemeProvider theme={defaultRebootTheme}>
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>
</ThemeProvider>)