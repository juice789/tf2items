import { combineReducers } from 'redux'
import * as aside from './aside.js'
import * as addItems from './addItems'

const rootReducer = combineReducers({
    ...aside,
    ...addItems
})

export default rootReducer 