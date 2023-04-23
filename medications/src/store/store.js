import { configureStore } from '@reduxjs/toolkit'

import medicationsReducer from './medicationsSlice.js'

export default configureStore({
    reducer: {
        medications: medicationsReducer,
    },
})