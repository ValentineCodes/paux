import React from 'react'
import { Text, VStack, Icon, HStack, Divider } from 'native-base'
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { Network } from '../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { Linking, Pressable } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import Modal from "react-native-modal"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../utils/styles';
import { truncateAddress } from '../utils/helperFunctions';
import { COLORS } from '../utils/constants';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    tx: any;
}

export default function TransactionDetails({ isVisible, onClose, tx }: Props) {
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const toast = useToast()

    const renderAction = () => {
        if (tx.functionName === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Transfer `
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Receive`
            }
        }

        return "Contract Interaction"
    }

    const renderTimestamp = () => {
        const d = new Date(Number(tx.timeStamp) * 1000)

        return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`
    }

    const calcGasFee = () => {
        return Number(ethers.utils.formatEther(BigNumber.from(tx.gasUsed).mul(BigNumber.from(tx.gasPrice)))).toFixed(5)
    }

    const calcTotalAmount = () => {
        const gasCost = BigNumber.from(tx.gasUsed).mul(BigNumber.from(tx.gasPrice))
        return Number(ethers.utils.formatEther(gasCost.add(tx.value))).toFixed(5)
    }

    const viewOnBlockExplorer = async () => {
        if (!connectedNetwork.blockExplorer) return

        try {
            await Linking.openURL(`${connectedNetwork.blockExplorer}/tx/${tx.hash}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="20" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>{renderAction()}</Text>
                    <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} onPress={onClose} />
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                        <Text fontSize={FONT_SIZE['sm']}>From</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{truncateAddress(tx.from)}</Text>
                    </VStack>

                    <VStack alignItems="flex-end">
                        <Text fontSize={FONT_SIZE['sm']}>To</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{truncateAddress(tx.to || tx.contractAddress)}</Text>
                    </VStack>
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                <HStack alignItems="center" justifyContent="space-between">
                    <VStack>
                        <Text fontSize={FONT_SIZE['sm']}>Nonce</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">#{tx.nonce}</Text>
                    </VStack>

                    <VStack alignItems="flex-end">
                        <Text fontSize={FONT_SIZE['sm']}>Date</Text>
                        <Text fontSize={FONT_SIZE['md']} fontWeight="medium">{renderTimestamp()}</Text>
                    </VStack>
                </HStack>

                <VStack borderWidth={0.5} mt="5" borderRadius={10} p="5" space={2}>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']}>Amount</Text>
                        <Text fontSize={FONT_SIZE['md']}>{ethers.utils.formatEther(BigNumber.from(tx.value))} {connectedNetwork.currencySymbol}</Text>
                    </HStack>

                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']}>Estimated gas fee</Text>
                        <Text fontSize={FONT_SIZE['md']}>{calcGasFee()} {connectedNetwork.currencySymbol}</Text>
                    </HStack>

                    <Divider bgColor="muted.300" my="2" />

                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['md']} bold>Total amount</Text>
                        <Text fontSize={FONT_SIZE['md']} bold>{calcTotalAmount()} {connectedNetwork.currencySymbol}</Text>
                    </HStack>
                </VStack>

                {connectedNetwork.blockExplorer && <Pressable onPress={viewOnBlockExplorer}><Text textAlign="center" mt="2" fontSize={FONT_SIZE['lg']} fontWeight="semibold" color={COLORS.primary}>View on block explorer</Text></Pressable>}
            </VStack>
        </Modal>
    )
}