import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type AppStackParamsList = {
  Onboarding: undefined;
}

const AppStack = createNativeStackNavigator<AppStackParamsList>();

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})

export default App;
