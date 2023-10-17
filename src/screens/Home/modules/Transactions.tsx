import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, VStack, Icon, Image, Divider } from 'native-base'
import { useSelector } from 'react-redux'
import Transaction from '../../../components/Transaction'
import { Account } from '../../../store/reducers/Accounts'
import TransactionsAPI from "../../../apis/transactions"
import { Network } from '../../../store/reducers/Networks'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useToast } from "react-native-toast-notifications"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../../../utils/constants'
import { FONT_SIZE } from '../../../utils/styles'

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

      if (transactions.result.length > 0) {
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
      const [results] = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentPage)

      const newTransactions = results.filter((result: any) => !transactions.some((transaction: any) => transaction.hash === result.hash))

      if (newTransactions.length > 0) {
        setTransactions([...transactions, ...newTransactions])
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
      {loadingStatus === 'loading' ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={3 * FONT_SIZE['xl']} color={COLORS.primary} />
        </View>
      ) : loadingStatus === 'error' ? (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <Image source={require("../../../assets/icons/failed_icon.png")} alt="Retry" style={styles.failedIcon} />
          <Text fontSize={1.1 * FONT_SIZE['lg']}>Failed to load transactions. <Text onPress={getTransactions} color={COLORS.primary} bold>Retry</Text></Text>
        </VStack>
      ) : transactions.length > 0 ? (
        <>
          <FlatList
            keyExtractor={(item) => item.hash}
            data={transactions}
            renderItem={({ item }) => <Transaction tx={item} />}
            ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
            ListFooterComponent={isLoadingMore ? <View py="4"><ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} /></View> : null}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.2}
          />
        </>
      ) : (
        <VStack flex="1" justifyContent="center" alignItems="center" space="4">
          <View bgColor={COLORS.primaryLight} p="4" borderRadius="full">
            <Icon as={<Ionicons name="swap-horizontal-outline" />} size={3 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
          </View>
          <Text fontSize={1.2 * FONT_SIZE['xl']} bold color="muted.400">No Transactions</Text>
        </VStack>
      )}



    </View>
  )
}

const styles = StyleSheet.create({
  loadingIndicator: {},
  failedIcon: {
    width: 7 * FONT_SIZE['xl'],
    height: 7 * FONT_SIZE['xl']
  }
})