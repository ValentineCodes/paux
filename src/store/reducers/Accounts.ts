import {createSlice} from '@reduxjs/toolkit';

export interface Account {
  name: string;
  address: string;
  isConnected: boolean;
}

export const accountsSlice = createSlice({
  name: 'ACCOUNTS',
  initialState: [] as Account[] | [],
  reducers: {
    addAccount: (state, action) => {
      return [
        ...state,
        {
          name: `Account ${state.length + 1}`,
          address: action.payload,
          isConnected: true,
        },
      ];
    },
    switchAccount: (state, action) => {
      // action.payload => account address
      return state.map(account => {
        if (account.address === action.payload) {
          return {...account, isConnected: true};
        } else {
          return {...account, isConnected: false};
        }
      });
    },
    removeAccount: (state, action) => {
      return state.filter(account => account.address !== action.payload);
    },
    changeName: (state, action) => {
      return state.map(account => {
        if (account.address === action.payload.address) {
          return {
            ...account,
            name: action.payload.newName,
          };
        } else {
          return account;
        }
      });
    },
  },
});

export const {addAccount, switchAccount, removeAccount, changeName} =
  accountsSlice.actions;

export default accountsSlice.reducer;
