import { View } from 'native-base'
import React from 'react'
import Header from './modules/Header'
import { StyleSheet } from 'react-native'
import MainBalance from './modules/MainBalance'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tokens from './modules/Tokens'
import Transactions from './modules/Transactions'

const Tab = createMaterialTopTabNavigator();

type Props = {}

function Home({}: Props) {
  return (
    <View style={styles.container}>
      <Header />
      <MainBalance />
      <Tab.Navigator>
        <Tab.Screen name="Tokens" component={Tokens} />
        <Tab.Screen name="Transactions" component={Transactions} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5
  }
})
export default Home