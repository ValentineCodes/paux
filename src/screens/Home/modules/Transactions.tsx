import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'native-base'
import { useSelector } from 'react-redux'
import Transaction from '../../../components/Transaction'
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
  const balance = useSelector(state => state.balance)

  const [transactions, setTransactions] = useState([])

  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const toast = useToast()

  const getTransactions = async () => {
    if (!connectedNetwork.txApiDomain) return
    if (loadingStatus !== 'loading' && balance === "") {
      setLoadingStatus('loading');
    }

    try {
      const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, 1)

      setTransactions(transactions.result)

      setLoadingStatus('success')

      if (transactions.result > 0) {
        setCurrentPage(2)
      }
    } catch (error) {
      setLoadingStatus('error')
    }
  }

  const loadMoreTransactions = async () => {
    if (isLoadingMore || transactions.length < 20) return

    setIsLoadingMore(true)

    try {
      const newTransactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentPage)

      if (newTransactions.result.length > 0) {
        setTransactions([...transactions, ...newTransactions.result])
        setCurrentPage(currentPage => currentPage + 1)
      }
    } catch (error) {
      return
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleRefresh = async () => {
    if (!connectedNetwork.txApiDomain) return
    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, 1)
      setTransactions(transactions.result)
      setCurrentPage(2)
    } catch (error) {
      toast.show("Failed to get transactions", {
        type: "danger"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [connectedNetwork, connectedAccount, balance])

  return (
    <View style={{ flex: 1 }}>
      <Text>Transaction:</Text>
      {loadingStatus === 'loading' ? (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>) : loadingStatus === 'error' ? <View>
        <Text>Failed to load transactions</Text>
        <Pressable onPress={getTransactions}><Text>Retry</Text></Pressable>
      </View> : transactions.length > 0 ? <FlatList
        keyExtractor={(item) => item.hash}
        data={transactions}
        renderItem={({ item }) => <Transaction tx={item} />}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
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