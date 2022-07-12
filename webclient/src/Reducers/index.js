import { combineReducers } from 'redux'
import * as asides from './asides.js'

const rootReducer = combineReducers({
    ...asides
})

export default rootReducer 