import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { Button, HStack, VStack, Icon, Text, View } from 'native-base'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { useNavigation } from '@react-navigation/native'
import PasswordInput from '../../components/forms/PasswordInput'
import { useToast } from 'react-native-toast-notifications'
import SInfo from "react-native-sensitive-info";
import { useSelector } from 'react-redux'
import { Account } from '../../store/reducers/Accounts'
import { Wallet } from '../../types/wallet'
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = {}

export default function PrivateKey({ }: Props) {
    const navigation = useNavigation()
    const toast = useToast()

    const [password, setPassword] = useState("")
    const [privateKey, setPrivateKey] = useState("")

    const connectedAccount: Account = useSelector(state => state.accounts.find(account => account.isConnected))

    const showPrivateKey = async () => {
        if (!password) {
            toast.show("Password cannot be empty", {
                type: "danger"
            })
            return
        }

        const _security = await SInfo.getItem("security", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        });
        const security = JSON.parse(_security!)

        if (password !== security.password) {
            toast.show("Incorrect password!", {
                type: "danger"
            })
            return
        }

        const accounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        const wallet: Wallet = Array.from(JSON.parse(accounts)).find(wallet => wallet.address == connectedAccount.address)

        setPrivateKey(wallet.privateKey)
    }

    const copyPrivateKey = () => {
        Clipboard.setString(privateKey)
        toast.show("Copied private key", {
            type: "normal"
        })
    }

    return (
        <VStack style={{ flex: 1, padding: 10 }}>
            <HStack alignItems="center" space={3}>
                <Icon as={<Ionicons name="arrow-back-outline" />} size={30} onPress={() => navigation.goBack()} />
                <Text>Show private key</Text>
            </HStack>

            {
                privateKey ? (
                    <VStack alignItems="center">
                        <QRCode value={privateKey} />
                        <HStack mt={3} ml={3} w="80%" alignItems="center">
                            <Text textAlign="center">{privateKey}</Text>
                            <Pressable style={{ marginLeft: 3 }} onPress={copyPrivateKey}>
                                <Icon as={<Ionicons name="copy-outline" />} size={5} color="muted.400" />
                            </Pressable>
                        </HStack>
                    </VStack>
                ) : (
                    <>

                        <PasswordInput label="Password" onChange={setPassword} />
                        <Button onPress={showPrivateKey}>Next</Button>
                    </>
                )
            }
        </VStack >
    )
}