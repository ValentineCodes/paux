import React, { useState } from 'react'
import { VStack, Text } from 'native-base';
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { Network } from '../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { Linking, Pressable } from 'react-native';
import TransactionDetails from './TransactionDetails';
import { View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

type Props = {
    tx: any;
}

export default function Transaction({ tx }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const [showTxDetails, setShowTxDetails] = useState(false)

    const toast = useToast()

    const toggleTxDetails = () => {
        setShowTxDetails(!showTxDetails)
    }

    const renderAction = () => {
        if (tx.contractAddress === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Sent ${connectedNetwork.currencySymbol}`
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Reveived ${connectedNetwork.currencySymbol}`
            }
        }

        return "Contract Interaction"
    }

    const renderTimestamp = () => {
        const d = new Date(Number(tx.timeStamp) * 1000)

        return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`
    }

    return (
        <View style={{ borderBottomWidth: 1, padding: 10 }}>
            <Pressable onPress={toggleTxDetails}>
                <Text>{renderAction()}</Text>
                <Text>{ethers.utils.formatEther(BigNumber.from(tx.value))}</Text>
                <Text>{renderTimestamp()}</Text>
            </Pressable>

            {showTxDetails && <TransactionDetails isVisible={showTxDetails} toggleVisibility={toggleTxDetails} tx={tx} />}
        </View>
    )
}