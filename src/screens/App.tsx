import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'native-base';

import Onboarding from './Authentication/Onboarding'
import WalletSetup from './Authentication/WalletSetup';
import CreateWallet from './Authentication/CreateWallet';
import ConfirmMnemonic from './Authentication/ConfirmMnemonic';
import ImportWallet from './Authentication/ImportWallet'
import CreatePassword from './Authentication/CreatePassword';
import Login from './Authentication/Login'
import Home from './Home'
import PrivateKey from './PrivateKey';
import { useSelector } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

type AppStackParamsList = {
  Onboarding: undefined;
  WalletSetup: undefined;
  ImportWallet: undefined;
  CreateWallet: undefined;
  ConfirmMnemonic: undefined;
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
            <StatusBar barStyle="dark-content" backgroundColor="white" />
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
                      <AppStack.Screen name="WalletSetup" component={WalletSetup} />
                      <AppStack.Screen name="CreateWallet" component={CreateWallet} />
                      <AppStack.Screen name="ConfirmMnemonic" component={ConfirmMnemonic} />
                      <AppStack.Screen name="ImportWallet" component={ImportWallet} />
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
    backgroundColor: "white",
    paddingHorizontal: 5
  }
})

export default App;
