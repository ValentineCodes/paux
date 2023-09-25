import React, { useState } from 'react'
import { Overlay, Button } from '@rneui/themed';
import { Icon, Input, Pressable, Text } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { useToast } from 'react-native-toast-notifications';
import SInfo from "react-native-sensitive-info";

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import { getProviderWithName, Providers } from '../../utils/providers';
import { useSelector } from 'react-redux';
import { Network } from '../../store/reducers/Networks';
import { Wallet } from '../../types/wallet';

type Props = {
    isVisible: boolean;
    toggleVisibility: () => void;
}

export default function TransferForm({ isVisible, toggleVisibility }: Props) {
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState("")

    const [isTransferring, setIsTransferring] = useState(false)

    const connectedNetwork: Network = useSelector((state: any) => state.networks.find((network: Network) => network.isConnected))
    const connectedAccount: Account = useSelector((state: any) => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const transfer = async () => {
        if (!ethers.utils.isAddress(address)) {
            toast.show("Invalid address", {
                type: "error"
            })
            return
        }
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.show("Invalid amount", {
                type: "error"
            })
            return
        }

        const accounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        const activeAccount: Wallet = Array.from(JSON.parse(accounts)).find(account => account.address == connectedAccount.address)

        const provider = getProviderWithName(connectedNetwork.name.toLowerCase() as keyof Providers)
        const wallet = new ethers.Wallet(activeAccount.privateKey).connect(provider)

        try {
            setIsTransferring(true)

            await wallet.sendTransaction({
                to: address,
                value: ethers.utils.parseEther(amount)
            })

            toast.show(`Successfully transferred ${amount} ${connectedNetwork.currencySymbol}`, {
                type: "success"
            })
            toggleVisibility()
        } catch (error) {
            toast.show("Transfer failed!", {
                type: "error"
            })
        } finally {
            setIsTransferring(false)
        }

    }

    return (
        <Overlay isVisible={isVisible} onBackdropPress={toggleVisibility}>
            <Input w={{
                base: "100%",
                md: "25%"
            }} type="text" placeholder='address' InputRightElement={<Pressable>
                <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
            </Pressable>} onChangeText={value => setAddress(value)} />
            {address.length !== 0 && !ethers.utils.isAddress(address) && <Text style={{ color: "red" }}>Invalid address</Text>}

            <Input w={{
                base: "100%",
                md: "25%"
            }} placeholder='amount' onChangeText={value => setAmount(value)} />

            <Button onPress={transfer} loading={isTransferring}>Send</Button>
        </Overlay>
    )
}