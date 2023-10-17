import { View } from 'native-base'
import React from 'react'
import Header from './modules/Header'
import { StyleSheet } from 'react-native'
import MainBalance from './modules/MainBalance'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Transactions from './modules/Transactions'
import { web3wallet } from '../../utils/Web3WalletClient'

const Tab = createMaterialTopTabNavigator();

type Props = {}

function Home({ }: Props) {
  return (
    <View style={styles.container}>
      <Header />
      <MainBalance />
      <Transactions />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  }
})
export default Home