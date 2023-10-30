import AsyncStorage from '@react-native-async-storage/async-storage';
import EIP155Lib from '../lib/EIP155';
import SInfo from "react-native-sensitive-info"
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

export let wallet1: EIP155Lib;
export let wallet2: EIP155Lib;
export let eip155Wallets: Record<string, EIP155Lib>;
export let eip155Addresses: string[];

export let address1: string;
let address2: string;

/**
 * Utilities
 */
export const setMnemonic = async (mnemonic: any) => {
  try {
    const value = await AsyncStorage.setItem('EIP155_MNEMONIC_1', mnemonic);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('setMnemonic Error:', e);
  }
};

export const getMnemonic = async () => {
  try {
    const value = await AsyncStorage.getItem('EIP155_MNEMONIC_1');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log('getLocalStorage Error:', e);
  }
};

export async function createOrRestoreEIP155Wallet() {
  let mnemonic1 = await getMnemonic();

  if (mnemonic1) {
    wallet1 = EIP155Lib.init({mnemonic: mnemonic1});
  } else {
    wallet1 = EIP155Lib.init({});
  }

  // @notice / Warning!!! : This is a test wallet, do not use it for real transactions
  setMnemonic(wallet1?.getMnemonic());
  address1 = wallet1.getAddress();

  eip155Wallets = {
    [address1]: wallet1,
    [address2]: wallet2,
  };
  eip155Addresses = Object.keys(eip155Wallets);

  return {
    eip155Wallets,
    eip155Addresses,
  };
}

export async function createWallet(accountIndex: number) {
    const mnemonic = await SInfo.getItem("mnemonic", {
        sharedPreferencesName: "pocket.android.storage",
        keychainService: "pocket.ios.storage",
    })
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic)

    const path = "m/44'/60'/0'/0/" + accountIndex
    const wallet = node.derivePath(path)

    return wallet
}

export async function createWalletWithSeedPhrase(seedPhrase: string, accountIndex: number) {
  const node = ethers.utils.HDNode.fromMnemonic(seedPhrase)

  const path = "m/44'/60'/0'/0/" + accountIndex
  const wallet = node.derivePath(path)

  return wallet
}
