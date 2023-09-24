import {createSlice} from '@reduxjs/toolkit';

export interface Account {
  name: string;
  address: string;
  isConnected: boolean;
  isImported: boolean;
}

export const accountsSlice = createSlice({
  name: 'ACCOUNTS',
  initialState: [] as Account[] | [],
  reducers: {
    initAccount: (state, action) => {
      return [{
        name: "Account 1",
        address: action.payload.address,
        isConnected: true,
        isImported: action.payload.isImported
      }]
    },
    addAccount: (state, action) => {
      const accounts = state.map(account => ({...account, isConnected: false}))
      return [
        ...accounts,
        {
          name: `Account ${state.length + 1}`,
          address: action.payload.address,
          isConnected: true,
          isImported: action.payload.isImported
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

export const {initAccount, addAccount, switchAccount, removeAccount, changeName} =
  accountsSlice.actions;

export default accountsSlice.reducer;
