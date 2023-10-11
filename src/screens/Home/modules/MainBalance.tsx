import { Image, Text, VStack, Button } from 'native-base'
import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import redstone from 'redstone-api';
import { useToast } from 'react-native-toast-notifications'

import { Account } from '../../../store/reducers/Accounts'
import { Network } from '../../../store/reducers/Networks'
import TransferForm from '../../../components/forms/TransferForm'
import { setBalance } from '../../../store/reducers/Balance'
import { getProviderWithName, Providers } from '../../../utils/providers'
import CopyableText from '../../../components/CopyableText'
import { truncateAddress } from '../../../utils/helperFunctions'

type Props = {}

function MainBalance({ }: Props) {
  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
  const balance = useSelector(state => state.balance)

  const [dollarValue, setDollarValue] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const toast = useToast()

  const getBalance = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
      const balance = await provider.getBalance(connectedAccount.address)
      const _balance = Number(ethers.utils.formatEther(balance)).toFixed(4)

      try {
        const price = await redstone.getPrice(connectedNetwork.currencySymbol);
        const dollarValue = Number(_balance) * price.value
        setDollarValue(dollarValue.toFixed(2))
      } catch (error) {
        setDollarValue(null)
        return
      } finally {
        dispatch(setBalance(_balance.toString()))
      }

    } catch (error) {
      toast.show("Failed to load balance", {
        type: "normal"
      })
      return
    } finally {
      setIsLoading(false)
    }

  }

  const refreshBalance = async () => {
    setRefresh(true)
    await getBalance()
    setRefresh(false)

  }

  const toggleTransferForm = () => {
    setShowTransferForm(!showTransferForm)
  }

  const logo = useMemo(() => {
    let _logo = require("../../../images/eth-icon.png");

    if (["Polygon", "Mumbai"].includes(connectedNetwork.name)) {
      _logo = require("../../../images/polygon-icon.png")
    } else if (["Arbitrum", "Arbitrum Goerli"].includes(connectedNetwork.name)) {
      _logo = require("../../../images/arbitrum-icon.png")
    } else if (["Optimism", "Optimism Goerli"].includes(connectedNetwork.name)) {
      _logo = require("../../../images/optimism-icon.png")
    }

    return <Image key={`${_logo}`} source={_logo} alt={connectedNetwork.name} width={50} height={50} />
  }, [connectedNetwork])

  useEffect(() => {
    const provider = getProviderWithName(connectedNetwork.name.toLowerCase() as keyof Providers)

    provider.off('block')

    provider.on('block', blockNumber => getBalance())

    return () => {
      provider.off("block")
    }
  }, [connectedAccount, connectedNetwork])

  return (
    <ScrollView style={{ flexGrow: 0 }} refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshBalance} />}>
      <VStack alignItems="center" space={2} paddingY={5}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{connectedAccount.name}</Text>
        <CopyableText displayText={truncateAddress(connectedAccount.address)} value={connectedAccount.address} />
        {logo}
        <VStack alignItems="center">
          <Text fontSize="xl" bold>{balance !== '' && `${balance} ${connectedNetwork.currencySymbol}`}</Text>
          {dollarValue !== null && <Text>${dollarValue}</Text>}
        </VStack>
        <Button.Group justifyContent="space-between">
          <Button onPress={() => setShowTransferForm(!showTransferForm)}>Transfer</Button>
        </Button.Group>
        {showTransferForm && <TransferForm isVisible={showTransferForm} toggleVisibility={toggleTransferForm} />}
      </VStack>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  percentDiff: {
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 5
  }
})

export default MainBalance