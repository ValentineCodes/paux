import { View } from 'native-base'
import React from 'react'
import Header from './modules/Header'
import { StyleSheet } from 'react-native'
import MainBalance from './modules/MainBalance'

type Props = {}

function Home({}: Props) {
  return (
    <View style={styles.container}>
      <Header />
      <MainBalance />
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