import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        open: false,
        content: null,
    },
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        },
        setContent: (state, action) => {
            state.content = action.payload
        }

    }
})

export const { set } = modalSlice.actions

export default modalSlice.reducer