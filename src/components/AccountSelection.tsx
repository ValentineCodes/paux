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
    onSelect: ((selectedAccounts: string) => void)
}

export default function AccountSelection({ isOpen, onClose, onSelect }: Props) {
    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [selectedAccount, setSelectedAccount] = useState("")

    const isAccountSelected = (account: string) => {
        return selectedAccount === account
    }

    const handleSelection = (account: string) => {
        if (!isAccountSelected(account)) {
            setSelectedAccount(account)
        }
    }

    useEffect(() => {
        setSelectedAccount(connectedAccount.address)
    }, [])

    return isOpen && (
        <Modal isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Select account to connect with</Modal.Header>
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
                <Button onPress={() => onSelect(selectedAccount)}>Next</Button>
                <Button onPress={onClose}>Cancel</Button>
            </Modal.Content>
        </Modal>
    )
}