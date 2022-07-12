import { combineReducers } from 'redux'
import * as aside from './aside.js'

const rootReducer = combineReducers({
    ...aside
})

export default rootReducer 