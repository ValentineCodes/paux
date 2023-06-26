import {createSlice} from '@reduxjs/toolkit';

interface KeyPair {
  privateKey: string;
  address: string;
}

const initialState: KeyPair[] = [];

export const slice = createSlice({
  name: 'KEY_PAIRS',
  initialState,
  reducers: {
    addKeyPair: (state, action) => {
      return [...state, action.payload];
    },
    removeKeyPair: (state, action) => {
      return state.filter(keyPair => keyPair.address !== action.payload);
    },
  },
});

export const {addKeyPair, removeKeyPair} = slice.actions;

export default slice.reducer;
