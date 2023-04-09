import { configureStore } from '@reduxjs/toolkit'
import timerReducer from './slices/timerSlice'

export default configureStore({
    reducer: {
        timer: timerReducer,
    },
})