import { combineReducers } from 'redux'

import userReducer from './user/reducer'
import questionReducer from './question/reducer'

const rootReducer = combineReducers({
    userReducer,
    questionReducer
})

export default rootReducer