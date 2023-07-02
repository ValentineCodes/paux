import {createSlice} from '@reduxjs/toolkit';
import {ALCHEMY_KEY} from '../../utils/constants';

import {Network} from './Networks';

const initialState: Network = {
  name: 'Ethereum',
  provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  chainId: 1,
  currencySymbol: 'ETH',
};

export const connectedNetworkSlice = createSlice({
  name: 'CONNECTED NETWORK',
  initialState,
  reducers: {
    updateConnectedNetwork: (state, action) => {
      return action.payload;
    },
  },
});

export const {updateConnectedNetwork} = connectedNetworkSlice.actions;

export default connectedNetworkSlice.reducer;
