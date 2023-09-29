import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList } from 'native-base'
import { useSelector } from 'react-redux'
import Transaction from '../../../components/Transaction'
import { Transaction as TransactionType } from '../../../store/reducers/Transactions'
import { Account } from '../../../store/reducers/Accounts'
import TransactionsAPI from "../../../apis/transactions"
import { Network } from '../../../store/reducers/Networks'

type Props = {}

type LoadingStatusProps = 'loading' | 'success' | 'error';

export default function Transactions({ }: Props) {

  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

  const [transactions, setTransactions] = useState([])

  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');

  const [currentPage, setCurrentPage] = useState(0)

  const getTransactions = async () => {
    if (loadingStatus !== 'loading') {
      setLoadingStatus('loading');
    }

    try {
      const transactions = await TransactionsAPI.getTransactions(connectedNetwork.txApiDomain, connectedNetwork.txApiKey, connectedAccount.address, currentPage)

      setTransactions(transactions.result)

      setLoadingStatus('success')

      setCurrentPage(currentPage => currentPage + 1)

    } catch (error) {
      console.log(error)
      setLoadingStatus('error')
    }
  }

  useEffect(() => {
    if (transactions.length === 0) {
      getTransactions()
    }
  }, [connectedNetwork, connectedAccount])
  return (
    <View>
      <Text>Transaction:</Text>
      {loadingStatus === 'loading' ? <Text>Loading...</Text> : <FlatList
        keyExtractor={(item: TransactionType) => item.nonce.toString()}
        data={transactions}
        renderItem={({ item }) => <Transaction tx={item} />}
      />}

    </View>
  )
}