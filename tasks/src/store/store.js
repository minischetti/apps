import { configureStore } from '@reduxjs/toolkit'

import itemsReducer from './itemsSlice.js'
import tagsReducer from './tagsSlice.js'

export default configureStore({
    reducer: {
        items: itemsReducer,
        tags: tagsReducer,
    },
})