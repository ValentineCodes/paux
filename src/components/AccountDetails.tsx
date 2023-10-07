import React, { useState } from 'react'
import { Alert } from "react-native"
import { Overlay } from '@rneui/themed';
import { Icon, Pressable, Button, Text, VStack, HStack } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications'

import { Account, removeAccount } from '../store/reducers/Accounts';
import EditAccountNameForm from './forms/EditAccountNameForm';
import { useNavigation } from '@react-navigation/native';
import CopyableText from './CopyableText';


type Props = {
    isVisible: boolean;
    toggleVisibility: () => void;
}

export default function AccountDetails({ isVisible, toggleVisibility }: Props) {
    const toast = useToast()

    const navigation = useNavigation()

    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [isAddressCopied, setIsAddressCopied] = useState(false)
    const [isEditingAccountName, setIsEditingAccountName] = useState(false)

    const copyAddress = () => {
        Clipboard.setString(connectedAccount.address)
        toast.show("Address copied to clipboard", {
            type: "normal"
        })
        setIsAddressCopied(true)
    }

    const showPrivateKey = () => {
        navigation.navigate("PrivateKey")
        toggleVisibility()
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
                        toggleVisibility()
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
    return (
        <Overlay isVisible={isVisible} onBackdropPress={toggleVisibility}>
            <VStack alignItems="center">
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
        </Overlay>
    )
}