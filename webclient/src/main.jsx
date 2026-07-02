import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'

import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose
} from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import storage from './localStorageAdapter'
import createSagaMiddleware from 'redux-saga'

import GlobalStyle from './globalStyle'
import { ThemeProvider } from './Components/Context'
import { theme } from './theme'

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)