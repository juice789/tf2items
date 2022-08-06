import { combineReducers } from 'redux'
import * as ui from './ui'
import * as items from './items'
import * as pages from './pages'
import { reducer as notificationReducer } from '@juice789/redux-saga-notifications'

const rootReducer = combineReducers({
    ...ui,
    ...items,
    ...pages,
    notificationReducer
})

export default rootReducer 