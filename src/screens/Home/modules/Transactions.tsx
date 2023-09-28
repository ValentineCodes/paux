import React from 'react'
import { View, Text, FlatList } from 'native-base'
import { useSelector } from 'react-redux'

type Props = {}

export default function Transactions({ }: Props) {
  const transactions = useSelector(state => state.transactions)

  return (
    <View>
      <Text>Transaction:</Text>
    </View>
  )
}