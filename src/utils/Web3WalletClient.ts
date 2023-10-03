import {Core} from '@walletconnect/core';
import {ICore} from '@walletconnect/types';
import {Web3Wallet, IWeb3Wallet} from '@walletconnect/web3wallet';
export let web3wallet: IWeb3Wallet;
export let core: ICore;
export let currentETHAddress: string;

export async function createWeb3Wallet() {
  // console.log('ENV_PROJECT_ID', ENV_PROJECT_ID);
  // console.log('ENV_RELAY_URL', ENV_RELAY_URL);
  core = new Core({
    // @notice: If you want the debugger / logs
    logger: 'debug',
    projectId: "2f4a3105d07d4a522d79d6907b6c4d8f",
    relayUrl: "wss://relay.walletconnect.com",
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'Pocket',
      description: 'A crypto wallet for managing funds on evm-compatible chains and interacting with DApps',
      url: 'https://walletconnect.com/',
      icons: [],
      redirect: {
        native: 'w3wrnsample://',
      },
    },
  });
}

export async function _pair(params: {uri: string}) {
  return await core.pairing.pair({uri: params.uri});
}
