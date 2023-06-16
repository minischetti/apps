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
            console.log(action.payload)
            state.content = action.payload
        }

    }
})

export const { setOpen, setContent } = modalSlice.actions

export default modalSlice.reducer