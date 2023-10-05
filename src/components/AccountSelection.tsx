import React, { useState, useEffect } from 'react'
import { Modal, Text, Button, HStack } from 'native-base';
import { Pressable, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Account } from '../store/reducers/Accounts';
import { truncateAddress } from '../utils/helperFunctions';
import BouncyCheckbox from "react-native-bouncy-checkbox";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: ((selectedAccounts: string[]) => void)
}

export default function AccountSelection({ isOpen, onClose, onSelect }: Props) {
    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

    const isAccountSelected = (account: string) => {
        return selectedAccounts.includes(account)
    }

    const handleSelectAll = () => {
        if (accounts.length === selectedAccounts.length) {
            setSelectedAccounts([])
        } else {
            setSelectedAccounts(accounts.map(account => account.address))
        }
    }

    const handleSelection = (account: string) => {
        if (isAccountSelected(account)) {
            // remove account
            setSelectedAccounts(selectedAccounts => selectedAccounts.filter(selectedAccount => selectedAccount !== account))
        } else {
            // add account
            setSelectedAccounts(selectedAccounts => [...selectedAccounts, account])
        }
    }

    useEffect(() => {
        setSelectedAccounts([connectedAccount.address])
    }, [])

    return isOpen && (
        <Modal isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Select account to connect with</Modal.Header>
                <Pressable onPress={handleSelectAll} style={{ padding: 10 }}>
                    <HStack alignItems="center" space={2}>
                        <BouncyCheckbox disableBuiltInState isChecked={accounts.length === selectedAccounts.length} fillColor='blue' onPress={handleSelectAll} />
                        <Text>Select all</Text>
                    </HStack>
                </Pressable>
                <FlatList
                    keyExtractor={item => item.address}
                    data={accounts}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelection(item.address)} style={{ padding: 10 }}>
                            <HStack alignItems="center" space={2}>
                                <BouncyCheckbox disableBuiltInState isChecked={isAccountSelected(item.address)} fillColor='blue' onPress={(isChecked) => handleSelection(item.address)} />
                                <Text>{item.name}({truncateAddress(item.address)})</Text>
                            </HStack>
                        </Pressable>
                    )}
                />
                <Button disabled={selectedAccounts.length === 0} onPress={() => onSelect(selectedAccounts)}>Next</Button>
                <Button onPress={onClose}>Cancel</Button>
            </Modal.Content>
        </Modal>
    )
}