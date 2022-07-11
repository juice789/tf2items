import { combineReducers } from 'redux'
import * as widgets from './widgets.js'

const rootReducer = combineReducers({
    ...widgets
})

export default rootReducer 