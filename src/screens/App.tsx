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
import ImportMnemonic from './Authentication/ImportMnemonic'
import CreatePassword from './Authentication/CreatePassword';

type AppStackParamsList = {
  Onboarding: undefined;
  GenerateMnemonic: undefined;
  ImportMnemonic: undefined;
  CreatePassword: undefined;
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

function App(): JSX.Element {
  return (
    <ToastProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
          <AppStack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <AppStack.Screen name="Onboarding" component={Onboarding} />
            <AppStack.Screen name="GenerateMnemonic" component={GenerateMnemonic} />
            <AppStack.Screen name="ImportMnemonic" component={ImportMnemonic} />
            <AppStack.Screen name="CreatePassword" component={CreatePassword} />
          </AppStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
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
