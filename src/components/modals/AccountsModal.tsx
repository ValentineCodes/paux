import { VStack, HStack, Icon, Divider, ScrollView, Pressable, Text } from 'native-base';
import React, { useState } from 'react'
import Modal from "react-native-modal"
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../utils/styles';
import { truncateAddress } from '../../utils/helperFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { Account, addAccount, switchAccount } from '../../store/reducers/Accounts';
import Button from "../../components/Button"
import Blockie from '../Blockie'
import SInfo from "react-native-sensitive-info"

import { Dimensions } from 'react-native';

import { COLORS } from '../../utils/constants';
import ImportAccountModal from './ImportAccountModal';
import { createWallet } from '../../utils/EIP155Wallet';


type Props = {
    isVisible: boolean;
    setVisibility: (isVisible: boolean) => void;
    onClose: () => void;
    onSelect: (account: string) => void;
}

export default function AccountsModal({ isVisible, setVisibility, onClose, onSelect }: Props) {
    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [showImportAccountModal, setShowImportAccountModal] = useState(false)

    const handleAccountSelection = (account: string) => {
        if (account !== connectedAccount.address) {
            dispatch(switchAccount(account))
            setVisibility(false)

            onSelect(account)
        }
    }

    const createAccount = async () => {
        let newAccount;

        for (let i = 0; i < Infinity; i++) {
            const wallet = await createWallet(i)

            if (accounts.find(account => account.address == wallet.address) == undefined) {
                newAccount = wallet
                break
            }
        }

        const createdAccounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        await SInfo.setItem("accounts", JSON.stringify([...JSON.parse(createdAccounts), { privateKey: newAccount.privateKey, address: newAccount.address }]), {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        dispatch(addAccount({ address: newAccount.address, isImported: false }))

        dispatch(switchAccount(newAccount.address))
        setVisibility(false)
    }

    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="30" p="5" space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Accounts</Text>
                    <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }}>
                        <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} />
                    </Pressable>
                </HStack>

                <Divider bgColor="muted.300" mt="2" />

                <ScrollView maxH={Dimensions.get("window").height / 4.8}>
                    {accounts.map((account, index) => (
                        <Pressable key={account.address} onPress={() => handleAccountSelection(account.address)}>
                            <HStack alignItems="center" justifyContent="space-between" paddingY={3} borderBottomWidth={index === accounts.length - 1 ? 0 : 1} borderBottomColor="muted.300">
                                <HStack alignItems="center" space={4}>
                                    <Blockie address={account.address} size={1.7 * FONT_SIZE["xl"]} />
                                    <VStack>
                                        <Text fontSize={FONT_SIZE['lg']} fontWeight="medium">{account.name}</Text>
                                        <Text>{truncateAddress(account.address)}</Text>
                                    </VStack>
                                </HStack>
                                {account.isConnected && <Icon as={<Ionicons name="checkmark-done" />} color={COLORS.primary} size={1.2 * FONT_SIZE['xl']} />}
                            </HStack>
                        </Pressable>
                    ))}
                </ScrollView>

                <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                    <Button text="Create" onPress={createAccount} style={{ width: "50%", borderRadius: 0 }} />
                    <Button type="outline" text="Import" onPress={() => setShowImportAccountModal(true)} style={{ width: "50%", borderRadius: 0 }} />
                </HStack>
            </VStack>

            <ImportAccountModal isVisible={showImportAccountModal} onClose={() => setShowImportAccountModal(false)} onImport={() => {
                setShowImportAccountModal(false)
                onClose()
            }} />
        </Modal>
    )
}