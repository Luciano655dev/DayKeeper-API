import { createStore } from 'redux'

import rootReducer from './rootReducer.tsx'

const store = createStore(rootReducer)
export default store