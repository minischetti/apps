import { createSlice } from '@reduxjs/toolkit';

export const medicationsSlice = createSlice({
    name: 'medications',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.medications.push(action.payload)
        },
        remove: (state, action) => {
            state.medications = state.medications.filter(medication => medication.id !== action.payload)
        },
        update: (state, action) => {
            const index = state.medications.findIndex(medication => medication.id === action.payload.id)
            state.medications[index] = action.payload
        }
    }
})

export const { add, remove, update } = medicationsSlice.actions

export default medicationsSlice.reducer