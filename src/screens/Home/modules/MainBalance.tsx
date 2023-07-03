import { HStack, Image, Text, VStack, Button } from 'native-base'
import React, {useState, useEffect} from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import redstone from 'redstone-api';

import { Account } from '../../../store/reducers/Accounts'
import { Network } from '../../../store/reducers/Networks'

type Props = {}

function MainBalance({}: Props) {
  const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))
  const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

  const [balance, setBalance] = useState<string | null>(null)
  const [dollarValue, setDollarValue] = useState<string | null>(null)

  const getBalance = async () => {
    setBalance(null)
    setDollarValue(null)
    try {
      const provider = new ethers.providers.JsonRpcProvider(connectedNetwork.provider)
      const balance = await provider.getBalance(connectedAccount.address)
      const _balance = ethers.utils.formatEther(balance)

      try {
        const price = await redstone.getPrice(connectedNetwork.currencySymbol);
        const dollarValue = Number(_balance) * price.value
        setDollarValue(dollarValue.toFixed(2))
      } catch(error) {
        return
      } finally {
        setBalance(_balance)
      }

    } catch(error) {
      return
    }

  }

  useEffect(() => {
    getBalance()
  }, [connectedAccount, connectedNetwork])
  return (
    <VStack alignItems="center" space={2} paddingY={5}>
        <Image source={require("../../../images/eth-icon.png")} alt="Ethereum" width={50} height={50} />
        <VStack alignItems="center">
          <Text fontSize="xl" bold>{balance !== null && `${balance} ${connectedNetwork.currencySymbol}`}</Text>
          {dollarValue !== null && <Text>${dollarValue}</Text>}
        </VStack>
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