import { HStack, Image, Text, VStack, Button } from 'native-base'
import React, {useState, useEffect} from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'

import { Account } from '../../../store/reducers/Accounts'
import { Network } from '../../../store/reducers/Networks'

type Props = {}

function MainBalance({}: Props) {
  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

  const [balance, setBalance] = useState<string | null>(null)

  const getBalance = async () => {
    setBalance(null)
    const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
    const balance = await provider.getBalance(connectedAccount.address)
    const _balance = ethers.utils.formatEther(balance)
    setBalance(_balance)
  }

  useEffect(() => {
    getBalance()
  }, [connectedAccount, connectedNetwork])
  return (
    <VStack alignItems="center" space={2} paddingY={5}>
        <Image source={require("../../../images/eth-icon.png")} alt="Ethereum" width={50} height={50} />
        <Text fontSize="xl" bold>{balance !== null && `${balance} ${connectedNetwork.currencySymbol}`}</Text>
        <HStack alignItems="center" space={2}>
            <Text>$85.27</Text>
            <Text style={[styles.percentDiff, {borderColor: "green", color: "green"}]}>12.2%</Text>
        </HStack>
        <Button.Group justifyContent="space-between">
          <Button>Deposit</Button>
          <Button>Transfer</Button>
        </Button.Group>
    </VStack>
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