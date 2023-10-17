import React, { useState } from 'react'
import { HStack, Text, Icon, Pressable, View, VStack } from 'native-base';
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { Network } from '../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import TransactionDetails from './TransactionDetails';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { COLORS } from '../utils/constants';
import { FONT_SIZE } from '../utils/styles';
import { truncateAddress } from '../utils/helperFunctions';

type Props = {
    tx: any;
}

export default function Transaction({ tx }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const [showTxDetails, setShowTxDetails] = useState(false)

    const toggleTxDetails = () => {
        setShowTxDetails(!showTxDetails)
    }

    const renderAction = () => {
        if (tx.functionName === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Transfer`
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Receive`
            }
        }

        return "Contract Interaction"
    }

    const renderActionIcon = () => {
        if (renderAction() === 'Transfer') {
            return (
                <View bgColor={COLORS.primaryLight} p="3" borderRadius="full">
                    <Icon as={<Ionicons name="paper-plane" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                </View>
            )
        }
        else if (renderAction() === "Receive") {
            return (
                <View bgColor={COLORS.primaryLight} p="3" borderRadius="full">
                    <Icon as={<Ionicons name="download" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                </View>
            )
        } else {
            return (
                <View bgColor={COLORS.primaryLight} p="3" borderRadius="full">
                    <Icon as={<Ionicons name="sync" />} size={1.2 * FONT_SIZE['xl']} color={COLORS.primary} borderRadius="full" />
                </View>
            )
        }
    }

    const renderAddress = () => {
        if (renderAction() === 'Transfer') {
            return (
                <Text fontSize={FONT_SIZE['md']}>To: {truncateAddress(tx.to || tx.contractAddress)}</Text>
            )
        }
        else if (renderAction() === "Receive") {
            return (
                <Text fontSize={FONT_SIZE['md']}>From: {truncateAddress(tx.from)}</Text>
            )
        } else {
            return (
                <Text fontSize={FONT_SIZE['md']}>Address: {tx.to || tx.contractAddress}</Text>
            )
        }
    }

    return (
        <Pressable onPress={toggleTxDetails}>
            <HStack justifyContent="space-between" alignItems="center" py="2">
                <HStack alignItems="center" space={4}>
                    {renderActionIcon()}

                    <VStack>
                        <Text fontSize={FONT_SIZE['xl']} bold>{renderAction()}</Text>
                        {renderAddress()}
                    </VStack>

                </HStack>

                <Text fontSize={FONT_SIZE['lg']} bold>{Number(ethers.utils.formatEther(BigNumber.from(tx.value))) ? Number(ethers.utils.formatEther(BigNumber.from(tx.value))).toFixed(2) : 0} {connectedNetwork.currencySymbol}</Text>
            </HStack>

            {showTxDetails && <TransactionDetails isVisible={showTxDetails} toggleVisibility={toggleTxDetails} tx={tx} />}
        </Pressable>
    )
}