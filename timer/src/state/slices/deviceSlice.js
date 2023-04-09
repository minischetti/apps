import { createSlice } from '@reduxjs/toolkit'

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    devices: []
  },
  reducers: {
    add: (state, action) => {
      // TODO: Check for correct payload
      state.devices.push(action.payload)
    },
    remove: (state, action) => {
      // TODO: Check for correct payload
      state.devices = state.devices.filter(device => device.id !== action.payload.id)
    },
  }
})

// Action creators are generated for each case reducer function
export const { add, remove } = deviceSlice.actions

export default deviceSlice.reducer