import { createSlice } from '@reduxjs/toolkit';

export const medicationsSlice = createSlice({
    name: 'medications',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            state = state.filter(medication => medication.id !== action.payload)
        },
        update: (state, action) => {
            const index = state.findIndex(medication => medication.id === action.payload.id)
            state[index] = action.payload
        }
    }
})

export const { add, remove, update } = medicationsSlice.actions

export default medicationsSlice.reducer