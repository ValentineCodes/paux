import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList } from 'native-base'
import { useSelector } from 'react-redux'
import Transaction from '../../../components/Transaction'
import { Transaction as TransactionType } from '../../../store/reducers/Transactions'
import { Account } from '../../../store/reducers/Accounts'
import TransactionsAPI from "../../../apis/transactions"
import { Network } from '../../../store/reducers/Networks'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import { useToast } from "react-native-toast-notifications"

type Props = {}

type LoadingStatusProps = 'loading' | 'success' | 'error';

export default function Transactions({ }: Props) {

  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

  const [transactions, setTransactions] = useState([])

  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const toast = useToast()

  const getTransactions = async () => {
    if (loadingStatus !== 'loading') {
      setLoadingStatus('loading');
    }

    try {
      const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentPage)

      console.log(transactions.result)
      setTransactions(transactions.result)

      setLoadingStatus('success')

      setCurrentPage(currentPage => currentPage + 1)

    } catch (error) {
      console.log(error)
      setLoadingStatus('error')
    }
  }

  const loadMoreTransactions = async () => {
    if (isLoadingMore) return

    setIsLoadingMore(true)

    try {
      const newTransactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentPage)

      if (newTransactions.result.length > 0) {
        setTransactions([...transactions, ...newTransactions.result])
        setCurrentPage(currentPage => currentPage + 1)
      } else {
        toast.show('No more videos', {
          type: 'normal',
          duration: 3000,
        });
      }
    } catch (error) {
      return
    } finally {
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    if (connectedNetwork.txApiDomain) {
      getTransactions()
    }
  }, [connectedNetwork, connectedAccount])

  return (
    <View style={{ flex: 1 }}>
      <Text>Transaction:</Text>
      {loadingStatus === 'loading' ? (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>) : loadingStatus === 'error' ? <View>
        <Text>Failed to load transactions</Text>
        <Pressable onPress={getTransactions}><Text>Retry</Text></Pressable>
      </View> : transactions.length > 0 ? <FlatList
        keyExtractor={(item: TransactionType) => item.nonce.toString()}
        data={transactions}
        renderItem={({ item }) => <Transaction tx={item} />}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.2}
      /> : <Text>No transactions</Text>}

      {isLoadingMore && <ActivityIndicator size="small" color="blue" style={styles.loadingIndicator} />}

    </View>
  )
}

const styles = StyleSheet.create({
  loadingIndicator: { position: 'absolute', bottom: 10, right: 10 },
})