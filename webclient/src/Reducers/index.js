import { combineReducers } from 'redux'
import * as ui from './ui'
import * as items from './items'
import * as pages from './pages'
import * as search from './search'

const rootReducer = combineReducers({
    ...ui,
    ...items,
    ...pages,
    ...search
})

export default rootReducer 