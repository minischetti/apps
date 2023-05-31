import { createSlice } from '@reduxjs/toolkit';

export const tagsSlice = createSlice({
    name: 'tags',
    initialState: [],
    reducers: {
        add: (state, action) => {
            // if the tag already exists, don't add it
            if (state.includes(action.payload)) {
                return state
            }
            // otherwise, add it
            state.push(action.payload)
        },
        remove: (state, action) => {
            return state.filter(tags => tags != action.payload)
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

export const { add, remove, update } = tagsSlice.actions

export default tagsSlice.reducer