import { configureStore } from '@reduxjs/toolkit'
import timerReducer from './slices/timerSlice'
import deviceReducer from './slices/deviceSlice'

export default configureStore({
    reducer: {
        timer: timerReducer,
        devices: deviceReducer,
    },
})