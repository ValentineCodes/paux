import {createSlice} from '@reduxjs/toolkit';

interface Account {
  privateKey: string;
  address: string;
}

const initialState: Account[] = [];

export const slice = createSlice({
  name: 'ACCOUNTS',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      return [...state, action.payload];
    },
    removeAccount: (state, action) => {
      return state.filter(account => account.address !== action.payload);
    },
  },
});

export const {addAccount, removeAccount} = slice.actions;

export default slice.reducer;
