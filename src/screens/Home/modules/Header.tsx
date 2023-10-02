import { Text, Select, CheckIcon, Box, HStack, Modal, VStack, Button, ScrollView, Icon } from 'native-base'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../../../store/reducers/Networks'
import { Account, addAccount, switchAccount } from '../../../store/reducers/Accounts'
import { Pressable, Linking, StyleSheet } from 'react-native'
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Share from 'react-native-share';
import { createWeb3Wallet, pair } from '../../App'
import { buildApprovedNamespaces } from '@walletconnect/utils'


import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import PrivateKeyForm from '../../../components/forms/PrivateKeyForm'

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AccountDetails from '../../../components/AccountDetails'
import { Camera } from 'react-native-camera-kit'
import { Web3Wallet } from '@walletconnect/web3wallet/dist/types/client'

type Props = {}

function Header({ }: Props) {
    const dispatch = useDispatch()
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)
    const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false)
    const [showAccountDetails, setShowAccountDetails] = useState(false)
    const [isScanningCode, setIsScanningCode] = useState(false)

    const accountInitialRef = useRef(null)
    const accountFinalRef = useRef(null)
    const wcscannerInitialRef = useRef(null)
    const wcscannerFinalRef = useRef(null)

    const wallet = useRef<Web3Wallet>(null)



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

        let wallet

        for (let i = 0; i < Infinity; i++) {
            const path = "m/44'/60'/0'/0/" + i
            const _wallet = node.derivePath(path)

            if (accounts.find(account => account.address == _wallet.address) == undefined) {
                wallet = _wallet
                break
            }
        }

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

    const togglePrivateKeyForm = () => {
        setShowPrivateKeyForm(!showPrivateKeyForm)
    }

    const toggleAccountDetails = () => {
        setShowAccountDetails(!showAccountDetails)
    }

    const shareAddress = async () => {
        try {
            await Share.open({ message: connectedAccount.address })
        } catch (error) {
            return
        }
    }

    const viewOnBlockExplorer = async () => {
        if (!connectedNetwork.blockExplorer) return

        try {
            await Linking.openURL(`${connectedNetwork.blockExplorer}/address/${connectedAccount.address}`)
        } catch (error) {
            toast.show("Cannot open url", {
                type: "danger"
            })
        }
    }

    useEffect(() => {
        (async () => {
            const web3wallet = await createWeb3Wallet()
            wallet.current = web3wallet

            web3wallet.on('session_proposal', async sessionProposal => {
                const { id, params } = sessionProposal

                // ------- namespaces builder util ------------ //
                const approvedNamespaces = buildApprovedNamespaces({
                    proposal: params,
                    supportedNamespaces: {
                        eip155: {
                            chains: ['eip155:1', 'eip155:137'],
                            methods: ['eth_sendTransaction', 'personal_sign'],
                            events: ['accountsChanged', 'chainChanged'],
                            accounts: [
                                'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
                                'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
                            ]
                        }
                    }
                })
                // ------- end namespaces builder util ------------ //

                const session = await web3wallet.approveSession({
                    id,
                    namespaces: approvedNamespaces
                })

                console.log("Session: ")
                console.log(session)
            })
        })()
    }, [])

    return (
        <HStack alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="#ccc" padding={2}>
            <Text fontSize="2xl" bold>Pocket</Text>

            <Box maxW="200">
                <Select selectedValue={connectedNetwork.chainId.toString()} minWidth="200" accessibilityLabel="Choose Network" placeholder="Choose Network" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={handleNetworkSelecttion}>
                    {networks.map((network: Network) => <Select.Item key={network.chainId} label={network.name} value={network.chainId.toString()} />)}
                </Select>
            </Box>

            <HStack>
                <Menu >
                    <MenuTrigger><Icon as={<Ionicons name="ellipsis-vertical-outline" />} size={5} color="black" /></MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => setIsAccountModalVisible(true)}>
                            <Text>Accounts</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => setShowAccountDetails(true)}>
                            <Text>Account details</Text>
                        </MenuOption>
                        <MenuOption onSelect={shareAddress}>
                            <Text>Share address</Text>
                        </MenuOption>
                        {connectedNetwork.blockExplorer && <MenuOption onSelect={viewOnBlockExplorer}>
                            <Text>View on block explorer</Text>
                        </MenuOption>}
                    </MenuOptions>
                </Menu>

                <Pressable onPress={async () => {
                    if (!wallet.current) return
                    wallet.current.pair({ uri: "wc:6f53f4ed-ea19-4b15-a8ad-957ab69d9004@1?bridge=https%3A%2F%2F4.bridge.walletconnect.org&key=377502b482ec20b4adbc82747c0a377a02b6f3e708b17e088f0acff58d02ba6c" })
                }}>
                    <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
                </Pressable>
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
                            <Button variant="outline" onPress={togglePrivateKeyForm}>
                                Import
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {isScanningCode && (
                <Modal isOpen onClose={() => setIsScanningCode(false)} initialFocusRef={wcscannerInitialRef} finalFocusRef={wcscannerFinalRef}>
                    <Camera
                        scanBarcode={true}
                        onReadCode={async (event) => {
                            console.log(event.nativeEvent.codeStringValue)
                            setIsScanningCode(false)
                        }}
                        showFrame={true}
                        laserColor='blue'
                        frameColor='white'
                        style={{ width: '100%', height: '100%' }}
                    />
                </Modal>
            )}
            <AccountDetails isVisible={showAccountDetails} toggleVisibility={toggleAccountDetails} />
            <PrivateKeyForm isVisible={showPrivateKeyForm} toggleVisibility={togglePrivateKeyForm} />
        </HStack>
    )
}

export default Header