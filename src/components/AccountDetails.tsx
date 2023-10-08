import React, { useState } from 'react'
import { Alert } from "react-native"
import { Icon, Button, Text, VStack, HStack, Modal } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';

import { Account, removeAccount } from '../store/reducers/Accounts';
import EditAccountNameForm from './forms/EditAccountNameForm';
import { useNavigation } from '@react-navigation/native';
import CopyableText from './CopyableText';


type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountDetails({ isOpen, onClose }: Props) {

    const navigation = useNavigation()

    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [isEditingAccountName, setIsEditingAccountName] = useState(false)

    const handleOnClose = () => {
        if (isEditingAccountName) {
            setIsEditingAccountName(false)
        }
        onClose()

    }

    const showPrivateKey = () => {
        navigation.navigate("PrivateKey")
        handleOnClose()
    }

    const remove = () => {
        Alert.alert(
            'Alert Title',
            'This action cannot be reversed. Are you sure you want to go through with this?',
            [
                {
                    text: "Yes, I'm sure",
                    onPress: () => {
                        dispatch(removeAccount(connectedAccount.address))
                        handleOnClose()
                    }
                },
                {
                    text: 'Not sure',
                    style: 'cancel',
                }
            ],
            {
                cancelable: true,
            },
        );
    }
    return isOpen && (
        <Modal isOpen onClose={handleOnClose}>
            <Modal.Content>
                <VStack alignItems="center" p="2">
                    {
                        isEditingAccountName ? <EditAccountNameForm close={() => setIsEditingAccountName(false)} /> : (
                            <HStack alignItems="center" space={2}>
                                <Text>{connectedAccount.name}</Text>
                                <Icon as={<Ionicons name="create-outline" />} size={5} color="muted.400" ml={3} onPress={() => setIsEditingAccountName(true)} />
                            </HStack>
                        )
                    }
                    <QRCode value={connectedAccount.address} />
                    <CopyableText value={connectedAccount.address} />
                    <Button onPress={showPrivateKey} mt={2}>Show private key</Button>
                    {accounts.length > 1 && <Button onPress={remove}>Remove account</Button>}
                </VStack>
            </Modal.Content>
        </Modal>
    )
}