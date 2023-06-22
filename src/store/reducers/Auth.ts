import {createSlice} from '@reduxjs/toolkit';

const initialState = '';

export const userSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    update: (state, action) => {
      return action.payload;
    },
  },
});

export const {update} = userSlice.actions;

export default userSlice.reducer;
