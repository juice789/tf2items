import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import { defaultRebootTheme } from 'styled-reboot'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from './globalStyle'

import rootReducer from './Reducers'
import rootSaga from './Sagas'

import App from './App'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['items', 'pages', 'usePages']
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

persistStore(store, null, () => { })

sagaMiddleware.run(rootSaga)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<ThemeProvider theme={defaultRebootTheme}>
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>
</ThemeProvider>)