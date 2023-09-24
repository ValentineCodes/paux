import { Text, Select, CheckIcon, Box, HStack, Modal, VStack, Button, ScrollView } from 'native-base'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../../../store/reducers/Networks'
import { Account, addAccount, switchAccount } from '../../../store/reducers/Accounts'
import { Pressable } from 'react-native'
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

type Props = {}

function Header({ }: Props) {
    const dispatch = useDispatch()
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)

    const accountInitialRef = useRef(null)
    const accountFinalRef = useRef(null)

    const networks: Network[] = useSelector(state => state.networks)
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const handleNetworkSelecttion = (chainId: string) => {
        dispatch(switchNetwork(chainId))
    }

    const handleAccountSelection = (account: string) => {
        if (account !== connectedAccount.address) {
            dispatch(switchAccount(account))
            setIsAccountModalVisible(false)
        }
    }

    const createAccount = async () => {
        const mnemonic = await SInfo.getItem("mnemonic", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })
        const node = ethers.utils.HDNode.fromMnemonic(mnemonic)
        let numOfAccountsFromMnemonic = 0
        accounts.forEach(account => {
            if (!account.isImported) {
                numOfAccountsFromMnemonic++
            }
        })

        const path = "m/44'/60'/0'/0/" + numOfAccountsFromMnemonic
        const wallet = node.derivePath(path)

        const createdAccounts = await SInfo.getItem("accounts", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        await SInfo.setItem("accounts", JSON.stringify([...JSON.parse(createdAccounts), { privateKey: wallet.privateKey, address: wallet.address }]), {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        })

        dispatch(addAccount({ address: wallet.address, isImported: false }))

        toast.show("Account created", {
            type: "success"
        })

        setIsAccountModalVisible(false)
    }

    return (
        <HStack alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="#ccc" padding={2}>
            <Text fontSize="2xl" bold>Pocket</Text>

            <HStack space={2}>
                <Box maxW="200">
                    <Select selectedValue={connectedNetwork.chainId.toString()} minWidth="200" accessibilityLabel="Choose Network" placeholder="Choose Network" _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                    }} mt={1} onValueChange={handleNetworkSelecttion}>
                        {networks.map((network: Network) => <Select.Item key={network.chainId} label={network.name} value={network.chainId.toString()} />)}
                    </Select>
                </Box>

                <Button onPress={() => setIsAccountModalVisible(true)}>Accounts</Button>
            </HStack>
            {/* Accounts */}
            <Modal isOpen={isAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} initialFocusRef={accountInitialRef} finalFocusRef={accountFinalRef}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>My Accounts</Modal.Header>
                    <Modal.Body maxHeight={200}>
                        <ScrollView>
                            {accounts.map((account, index) => (
                                <Pressable key={account.address} onPress={() => handleAccountSelection(account.address)}>
                                    <HStack alignItems="center" justifyContent="space-between" paddingY={3} borderBottomWidth={index === accounts.length - 1 ? 0 : 1} borderBottomColor="#ccc">
                                        <VStack>
                                            <Text>{account.name}</Text>
                                        </VStack>
                                        {account.isConnected && <CheckIcon />}
                                    </HStack>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button onPress={createAccount}>
                                Create
                            </Button>
                            <Button variant="outline">
                                Import
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </HStack>
    )
}

export default Header