import { View } from 'native-base'
import React, { useEffect } from 'react'
import Header from './modules/Header'
import { BackHandler, StyleSheet } from 'react-native'
import MainBalance from './modules/MainBalance'
import Transactions from './modules/Transactions'

type Props = {}

function Home({ }: Props) {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    BackHandler.exitApp();

    return true;
  });

  useEffect(() => {
    return () => {
      backHandler.remove();
    };
  }, [])
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