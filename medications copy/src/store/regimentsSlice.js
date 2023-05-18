import { createSlice } from '@reduxjs/toolkit';

export const regimentsSlice = createSlice({
    name: 'regiments',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            state = state.filter(regiment => regiment.id !== action.payload)
        },
        update: (state, action) => {
            const index = state.findIndex(regiment => regiment.id === action.payload.id)
            state[index] = action.payload
        }
    }
})

export const { add, remove, update } = regimentsSlice.actions

export default regimentsSlice.reducer