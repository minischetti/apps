import { configureStore } from '@reduxjs/toolkit'

import medicationsReducer from './medicationsSlice.js'
import regimentsReducer from './regimentsSlice.js'
import modalReducer from './modalSlice.js'

export default configureStore({
    reducer: {
        medications: medicationsReducer,
        regiments: regimentsReducer,
        modal: modalReducer,
    },
})