import { createSlice } from '@reduxjs/toolkit';

export const itemsSlice = createSlice({
    name: 'items',
    initialState: [],
    reducers: {
        add: (state, action) => {
            state.push(action.payload)
        },
        remove: (state, action) => {
            // splice returns an array of the removed elements
            // so we need to get the first element of the array
            // and return that
            return state.filter(item => item.id != action.payload)
        },
        update: (state, action) => {
            const index = state.findIndex(item => item.id == action.payload.id)
            state[index] = {
                ...state[index],
                ...action.payload
            }
            console.log(state[index])
            return state
        }
    }
})

export const { add, remove, update } = itemsSlice.actions

export default itemsSlice.reducer