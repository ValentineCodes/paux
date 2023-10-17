import { Image, Text, VStack, Button, Divider, Pressable, Icon, View, HStack } from 'native-base'
import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import redstone from 'redstone-api';
import Ionicons from "react-native-vector-icons/dist/Ionicons"

import { Account } from '../../../store/reducers/Accounts'
import { Network } from '../../../store/reducers/Networks'
import TransferForm from '../../../components/forms/TransferForm'
import { setBalance } from '../../../store/reducers/Balance'
import { getProviderWithName, Providers } from '../../../utils/providers'
import CopyableText from '../../../components/CopyableText'
import { truncateAddress } from '../../../utils/helperFunctions'
import { FONT_SIZE } from '../../../utils/styles'
import { COLORS } from '../../../utils/constants'
import ReceiveModal from '../../../components/modals/ReceiveModal'

type Props = {}

function MainBalance({ }: Props) {
  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
  const balance = useSelector(state => state.balance)

  const [dollarValue, setDollarValue] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const getBalance = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
      const balance = await provider.getBalance(connectedAccount.address)
      const _balance = Number(ethers.utils.formatEther(balance)) ? Number(ethers.utils.formatEther(balance)).toFixed(4) : 0

      try {
        const price = await redstone.getPrice(connectedNetwork.currencySymbol);
        const dollarValue = Number(_balance) * price.value
        setDollarValue(dollarValue ? dollarValue.toFixed(2) : "0")
      } catch (error) {
        setDollarValue(null)
        return
      } finally {
        dispatch(setBalance(_balance.toString()))
      }

    } catch (error) {
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

    return <Image key={`${_logo}`} source={_logo} alt={connectedNetwork.name} style={styles.networkLogo} />
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
      <VStack alignItems="center" space={2} paddingTop={5}>
        <Text fontSize={FONT_SIZE["xl"]} bold textAlign="center">{connectedAccount.name}</Text>
        <CopyableText displayText={truncateAddress(connectedAccount.address)} value={connectedAccount.address} />
        {logo}
        <VStack alignItems="center">
          <Text fontSize={2 * FONT_SIZE["xl"]} bold textAlign="center">{balance !== '' && `${balance} ${connectedNetwork.currencySymbol}`}</Text>
          {dollarValue !== null && <Text fontSize={FONT_SIZE['lg']} bold textAlign="center" mt="2">${dollarValue}</Text>}
        </VStack>

        <Divider bgColor="muted.100" my="2" />

        <HStack alignItems="center" space="10">
          <Pressable alignItems="center" onPress={() => setShowTransferForm(!showTransferForm)}>
            <View bgColor={COLORS.primaryLight} p="4" borderRadius="full">
              <Icon as={<Ionicons name="paper-plane" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
            </View>
            <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Send</Text>
          </Pressable>

          <Pressable alignItems="center" onPress={() => setShowReceiveModal(true)}>
            <View bgColor={COLORS.primaryLight} p="4" borderRadius="full">
              <Icon as={<Ionicons name="download" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
            </View>
            <Text fontSize={FONT_SIZE["lg"]} bold mt="2">Receive</Text>
          </Pressable>
        </HStack>

        <Divider bgColor="muted.100" mt="2" />

        {showTransferForm && <TransferForm isVisible={showTransferForm} toggleVisibility={toggleTransferForm} />}
        <ReceiveModal isVisible={showReceiveModal} onClose={() => setShowReceiveModal(false)} />
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
  },
  networkLogo: {
    width: 4 * FONT_SIZE["xl"],
    height: 4 * FONT_SIZE["xl"],
  }
})

export default MainBalance