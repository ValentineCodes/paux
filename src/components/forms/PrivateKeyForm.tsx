import React, { useState } from 'react'
import { Overlay } from '@rneui/themed';
import { Icon, Input, Pressable, Button, Text } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import { useDispatch, useSelector } from 'react-redux';
import { Account, addAccount } from '../../store/reducers/Accounts';

type Props = {
    isVisible: boolean;
    toggleVisibility: () => void;
}

export default function PrivateKeyForm({ isVisible, toggleVisibility }: Props) {
    const [privateKey, setPrivateKey] = useState("")
    const toast = useToast()
    const dispatch = useDispatch()
    const accounts: Account[] = useSelector(state => state.accounts)

    const importWallet = async () => {
        try {
            const wallet = new ethers.Wallet(privateKey)

            if (accounts.find(account => account.address == wallet.address) != undefined) {
                toast.show("Account already exists", {
                    type: "normal"
                })
                return
            }

            const createdAccounts = await SInfo.getItem("accounts", {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            })

            await SInfo.setItem("accounts", JSON.stringify([...JSON.parse(createdAccounts), { privateKey: privateKey, address: wallet.address }]), {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            })

            dispatch(addAccount({ address: wallet.address, isImported: true }))

            toast.show("Account imported", {
                type: "success"
            })

            toggleVisibility()
        } catch (error) {
            toast.show("Invalid private key", {
                type: "error"
            })
        }

    }

    return (
        <Overlay isVisible={isVisible} onBackdropPress={toggleVisibility}>
            <Input w={{
                base: "100%",
                md: "25%"
            }} type="text" placeholder='private key' InputRightElement={<Pressable>
                <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
            </Pressable>} onChangeText={value => setPrivateKey(value)} />

            <Button onPress={importWallet}>Import</Button>
        </Overlay>
    )
}