import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'native-base';

import Onboarding from './Authentication/Onboarding';
import GenerateMnemonic from './Authentication/GenerateMnemonic';
import ConfirmMnemonic from './Authentication/ConfirmMnemonic';
import ImportMnemonic from './Authentication/ImportMnemonic'
import CreatePassword from './Authentication/CreatePassword';
import Login from './Authentication/Login'
import Home from './Home'
import PrivateKey from './PrivateKey';
import { useSelector } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

import { Core } from '@walletconnect/core'
// import { ICore } from '@walletconnect/types' <- Add if using TS
import { Web3Wallet, IWeb3Wallet } from '@walletconnect/web3wallet'

// export let web3wallet: IWeb3Wallet <- Add if using TS
// export let core: ICore <- Add if using TS

const core = new Core({
  projectId: '2f4a3105d07d4a522d79d6907b6c4d8f'
})

export async function createWeb3Wallet() {
  return await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: {
      name: 'Pocket',
      description: 'A crypto wallet for managing funds on evm-compatible chains and interacting with DApps',
      url: '',
      icons: []
    }
  })
}

export async function pair(params: { uri: string }) {
  return await core.pairing.pair({ uri: params.uri })
}

type AppStackParamsList = {
  Onboarding: undefined;
  GenerateMnemonic: undefined;
  ConfirmMnemonic: undefined;
  ImportMnemonic: undefined;
  CreatePassword: undefined;
  Login: undefined;
  Home: undefined;
  PrivateKey: undefined;
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

function App(): JSX.Element {
  const auth = useSelector(state => state.auth)

  return (
    <ToastProvider>
      <MenuProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <NavigationContainer>
              <AppStack.Navigator
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}>
                {
                  !auth.isLoggedIn && (
                    <>
                      <AppStack.Screen name="Onboarding" component={Onboarding} />
                      <AppStack.Screen name="GenerateMnemonic" component={GenerateMnemonic} />
                      <AppStack.Screen name="ConfirmMnemonic" component={ConfirmMnemonic} />
                      <AppStack.Screen name="ImportMnemonic" component={ImportMnemonic} />
                      <AppStack.Screen name="CreatePassword" component={CreatePassword} />
                    </>
                  )
                }
                <AppStack.Screen name="Login" component={Login} />
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="PrivateKey" component={PrivateKey} />
              </AppStack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </MenuProvider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})

export default App;
