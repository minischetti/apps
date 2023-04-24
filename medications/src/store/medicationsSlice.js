import { createSlice } from '@reduxjs/toolkit';

export const medicationsSlice = createSlice({
    name: 'medications',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            // splice returns an array of the removed elements
            // so we need to get the first element of the array
            // and return that
            return state.filter(medication => medication.id != action.payload)
        },
        update: (state, action) => {
            const index = state.findIndex(medication => medication.id == action.payload.id)
            state[index] = {
                ...state[index],
                ...action.payload
            }
            console.log(state[index])
            return state
        }
    }
})

export const { add, remove, update } = medicationsSlice.actions

export default medicationsSlice.reducer