import { combineReducers } from 'redux'
import * as ui from './ui'
import * as items from './items'
import * as pages from './pages'

const rootReducer = combineReducers({
    ...ui,
    ...items,
    ...pages
})

export default rootReducer 