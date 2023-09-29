import React, { useRef } from 'react'
import { Modal, Text } from 'native-base'
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { Network } from '../store/reducers/Networks';

import "react-native-get-random-values"
import "@ethersproject/shims"
import { BigNumber, ethers } from "ethers";
import { Linking, Pressable } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

type Props = {
    isVisible: boolean;
    toggleVisibility: () => void;
    tx: any;
}

export default function TransactionDetails({ isVisible, toggleVisibility, tx }: Props) {
    const transactionDetailsInitialRef = useRef(null)
    const transactionDetailsFinalRef = useRef(null)

    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))
    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))

    const toast = useToast()

    const renderAction = () => {
        if (tx.functionName === '') {
            if (tx.from.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Sent ${connectedNetwork.currencySymbol}`
            }
            if (tx.to.toLowerCase() == connectedAccount.address.toLowerCase()) {
                return `Received ${connectedNetwork.currencySymbol}`
            }
        }

        return "Contract Interaction"
    }

    const renderTimestamp = () => {
        const d = new Date(Number(tx.timeStamp) * 1000)

        return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`
    }

    const calcGasFee = () => {
        return ethers.utils.formatEther(BigNumber.from(tx.gasUsed).mul(BigNumber.from(tx.gasPrice)))
    }

    // const calcTotalAmount = () => {
    //     return BigNumber.from(ethers.utils.formatEther(BigNumber.from(tx.value))).add()
    // }

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
        <Modal isOpen={isVisible} onClose={toggleVisibility} initialFocusRef={transactionDetailsInitialRef} finalFocusRef={transactionDetailsFinalRef}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{renderAction()}</Modal.Header>
                <Modal.Body>
                    <Text>Nonce: {tx.nonce}</Text>
                    <Text>Date: {renderTimestamp()}</Text>
                    <Text>From: {tx.from}</Text>
                    <Text>To: {tx.to || tx.contractAddress}</Text>
                    <Text>Amount: {ethers.utils.formatEther(BigNumber.from(tx.value))}</Text>
                    {tx.from.toLowerCase() === connectedAccount.address.toLowerCase() && (
                        <>
                            <Text>Estimated gas fee: {calcGasFee()}</Text>
                            {/* <Text>Total amount: {calcTotalAmount()}</Text> */}
                        </>
                    )}
                    {connectedNetwork.blockExplorer && <Pressable onPress={viewOnBlockExplorer}>
                        <Text>View on block explorer</Text>
                    </Pressable>}
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}