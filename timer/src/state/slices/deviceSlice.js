import { createSlice } from '@reduxjs/toolkit'

export const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    value: []
  },
  reducers: {
    add: (state, action) => {
      // TODO: Check for correct payload
      console.log('state', state)
      console.log('add', action.payload)
      state.value.push(action.payload)
    },
    remove: (state, action) => {
      // TODO: Check for correct payload
      console.log('state', state)
      console.log('remove', action.payload)
      state.value = state.value.filter(device => device.id !== action.payload.id)
    },
  }
})

// Action creators are generated for each case reducer function
export const { add, remove } = deviceSlice.actions

export default deviceSlice.reducer