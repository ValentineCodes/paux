import {createSlice} from '@reduxjs/toolkit';
import {ALCHEMY_KEY} from '../../utils/constants';

export interface Network {
  name: string;
  provider: string;
  chainId: number;
  currencySymbol: string;
  isConnected: boolean;
}

const initialState: Network[] = [
  {
    name: 'Localhost',
    provider: 'http://127.0.0.1:8545/',
    chainId: 31337,
    currencySymbol: 'ETH',
    isConnected: false,
  },
  {
    name: 'Ethereum',
    provider: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    chainId: 1,
    currencySymbol: 'ETH',
    isConnected: true,
  },
  {
    name: 'Sepolia',
    provider: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 11155111,
    currencySymbol: 'SepoliaETH',
    isConnected: false,
  },
  {
    name: 'Goerli',
    provider: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    chainId: 5,
    currencySymbol: 'GoerliETH',
    isConnected: false,
  },
  {
    name: 'Arbitrum',
    provider: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 42161,
    currencySymbol: 'ARB',
    isConnected: false,
  },
  {
    name: 'Arbitrum Goerli',
    provider: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 421613,
    currencySymbol: 'AGOR',
    isConnected: false,
  },
  {
    name: 'Optimism',
    provider: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 10,
    currencySymbol: 'OP',
    isConnected: false,
  },
  {
    name: 'Optimism Goerli',
    provider: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 420,
    currencySymbol: 'ETH',
    isConnected: false,
  },
  {
    name: 'Polygon',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 137,
    currencySymbol: 'MATIC',
    isConnected: false,
  },
  {
    name: 'Mumbai',
    provider: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    chainId: 80001,
    currencySymbol: 'MATIC',
    isConnected: false,
  },
];

export const networksSlice = createSlice({
  name: 'NETWORKS',
  initialState,
  reducers: {
    addNetwork: (state, action) => {
      return [...state, action.payload];
    },
    switchNetwork: (state, action) => {
      // action.payload => network chainId
      return state.map(network => {
        if (network.chainId === Number(action.payload)) {
          return {...network, isConnected: true};
        } else {
          return {...network, isConnected: false};
        }
      });
    },
  },
});

export const {addNetwork, switchNetwork} = networksSlice.actions;

export default networksSlice.reducer;
