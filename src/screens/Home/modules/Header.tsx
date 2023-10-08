import { Text, Select, CheckIcon, Box, HStack, Modal, VStack, Button, ScrollView, Icon } from 'native-base'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../../../store/reducers/Networks'
import { Account, addAccount, switchAccount } from '../../../store/reducers/Accounts'
import { Pressable, Linking } from 'react-native'
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Share from 'react-native-share';
import { SignClientTypes, SessionTypes } from '@walletconnect/types';

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
import ConnectModal from '../../../components/modals/ConnectModal'
import { _pair, web3wallet } from '../../../utils/Web3WalletClient'
import ApprovalModal from '../../../components/modals/ApprovalModal'
import { handleDeepLinkRedirect } from '../../../utils/LinkingUtils'
import { getSdkError } from '@walletconnect/utils';
import { addConnectedSite } from '../../../store/reducers/ConnectedSites'
import ConnectedSitesModal from '../../../components/modals/ConnectedSitesModal'
import AccountSelection from '../../../components/AccountSelection'
import { ActiveSession, addSession } from '../../../store/reducers/ActiveSessions'
import SwitchAccountModal from '../../../components/modals/SwitchAccountModal'
import { EIP155_SIGNING_METHODS } from '../../../data/EIP155';
import { SignModal } from '../../../components/modals/SignModal'
import { SignTypedDataModal } from '../../../components/modals/SignTypedDataModal'
import { SendTransactionModal } from '../../../components/modals/SendTransactionModal'
import { truncateAddress } from '../../../utils/helperFunctions'

type Props = {}

function Header({ }: Props) {
    const dispatch = useDispatch()
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)
    const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false)
    const [showAccountDetails, setShowAccountDetails] = useState(false)
    const [showConnectedSites, setShowConnectedSites] = useState(false)
    const [showAccountSelection, setShowAccountSelection] = useState(false)
    const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false)
    const [showSignModal, setShowSignModal] = useState(false)
    const [showSignTypedDataModal, setShowSignTypedDataModal] = useState(false)
    const [showSendTransactionModal, setShowSendTransactionModal] = useState(false)

    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [isPairing, setIsPairing] = useState(false)
    const [proposal, setProposal] =
        useState<SignClientTypes.EventArguments['session_proposal']>();

    const [requestEventData, setRequestEventData] = useState();
    const [requestSession, setRequestSession] = useState();

    const [selectedAccount, setSelectedAccount] = useState<string>("")


    const accountInitialRef = useRef(null)
    const accountFinalRef = useRef(null)

    const networks: Network[] = useSelector(state => state.networks)
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const activeSessions: ActiveSession[] = useSelector(state => state.activeSessions)

    const toast = useToast()

    const handleNetworkSelecttion = (chainId: string) => {
        dispatch(switchNetwork(chainId))
    }

    const handleAccountSelection = (account: string) => {
        if (account !== connectedAccount.address) {
            dispatch(switchAccount(account))
            setIsAccountModalVisible(false)
        }

        const canSwitchSessionAccount = activeSessions.some(session => session.account !== account)

        if (canSwitchSessionAccount) {
            setShowSwitchAccountModal(true)
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

    const pair = async (uri: string) => {
        try {
            setIsPairing(true)
            const pairResponse = await _pair({ uri })
            setShowConnectModal(false)
            setShowAccountSelection(true)
            return pairResponse

        } catch (error) {
            toast.show("Failed to connect. Please try again", {
                type: "danger"
            })
        } finally {
            setIsPairing(false)
        }
    }

    const handleSessionProposal = useCallback((proposal: SignClientTypes.EventArguments['session_proposal']) => {
        setProposal(proposal)
    }, [])

    const handleSessionRequest = useCallback(async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
        const { topic, params } = requestEvent;
        const { request } = params;
        const requestSessionData =
            web3wallet.engine.signClient.session.get(topic);

        switch (request.method) {
            case EIP155_SIGNING_METHODS.ETH_SIGN:
            case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                setShowSignModal(true);
                return;

            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                setShowSignTypedDataModal(true);
                return;
            case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                setShowSendTransactionModal(true);
                return;
        }
    }, [])

    const handleAcceptProposal = async () => {
        const { id, params } = proposal;
        const { requiredNamespaces, relays } = params;

        if (proposal) {
            // Cooking namespaces
            const namespaces: SessionTypes.Namespaces = {};
            Object.keys(requiredNamespaces).forEach(key => {
                const accounts: string[] = [];
                requiredNamespaces[key].chains.forEach(chain => {
                    accounts.push(`${chain}:${selectedAccount}`);
                });

                namespaces[key] = {
                    accounts,
                    methods: requiredNamespaces[key].methods,
                    events: requiredNamespaces[key].events,
                };
            });

            const session = await web3wallet.approveSession({
                id,
                relayProtocol: relays[0].protocol,
                namespaces,
            });

            setShowApprovalModal(false)

            const sessionMetadata = session?.peer?.metadata;

            const connectedSite = {
                name: sessionMetadata.url,
                topic: session.topic
            }

            const activeSession = {
                site: sessionMetadata.url,
                topic: session.topic,
                requiredNamespaces,
                chainId: connectedNetwork.chainId,
                account: selectedAccount
            }

            dispatch(addSession(activeSession))
            dispatch(addConnectedSite(connectedSite))

            handleDeepLinkRedirect(sessionMetadata?.redirect);
        }
    }
    const handleRejectProposal = async () => {
        setShowApprovalModal(false);

        if (!proposal) {
            return;
        }

        await web3wallet.rejectSession({
            id: proposal.id,
            reason: getSdkError('USER_REJECTED_METHODS'),
        });
    }

    useEffect(() => {
        if (showConnectModal || showApprovalModal || showSignModal || showSignTypedDataModal || showSendTransactionModal) {
            web3wallet.on("session_proposal", handleSessionProposal)
            web3wallet.on("session_request", handleSessionRequest)
        }
    }, [showConnectModal, showApprovalModal, showSignModal, showSignTypedDataModal, showSendTransactionModal, requestEventData,
        requestSession, handleSessionProposal, handleSessionRequest])

    const handleAccountsSelection = (selectedAccount: string) => {
        setSelectedAccount(selectedAccount)
        setShowAccountSelection(false)
        setShowApprovalModal(true)
    }

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
                        <MenuOption onSelect={() => setShowConnectedSites(true)}>
                            <Text>Connected sites</Text>
                        </MenuOption>
                        <MenuOption onSelect={shareAddress}>
                            <Text>Share address</Text>
                        </MenuOption>
                        {connectedNetwork.blockExplorer && <MenuOption onSelect={viewOnBlockExplorer}>
                            <Text>View on block explorer</Text>
                        </MenuOption>}
                    </MenuOptions>
                </Menu>

                <Pressable onPress={() => setShowConnectModal(true)}>
                    <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
                </Pressable>
            </HStack>

            <ConnectModal isOpen={showConnectModal} isPairing={isPairing} onClose={() => setShowConnectModal(false)} pair={pair} />
            <ApprovalModal proposal={proposal} isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} handleAccept={handleAcceptProposal} handleReject={handleRejectProposal} />

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
                                            <Text>{truncateAddress(account.address)}</Text>
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

            {requestEventData && requestSession && showSignModal && (
                <SignModal
                    visible={showSignModal}
                    setVisible={setShowSignModal}
                    requestEvent={requestEventData}
                    requestSession={requestSession}
                />
            )}

            {requestEventData && requestSession && showSignTypedDataModal && (
                <SignTypedDataModal
                    visible={showSignTypedDataModal}
                    setVisible={setShowSignTypedDataModal}
                    requestEvent={requestEventData}
                    requestSession={requestSession}
                />
            )}

            {requestEventData && requestSession && showSendTransactionModal && (
                <SendTransactionModal
                    visible={showSendTransactionModal}
                    setVisible={setShowSendTransactionModal}
                    requestEvent={requestEventData}
                    requestSession={requestSession}
                />
            )}

            <SwitchAccountModal isOpen={showSwitchAccountModal} onClose={() => setShowSwitchAccountModal(false)} />
            <AccountSelection isOpen={showAccountSelection} onClose={() => setShowAccountSelection(false)} onSelect={handleAccountsSelection} />
            <AccountDetails isVisible={showAccountDetails} toggleVisibility={toggleAccountDetails} />
            <ConnectedSitesModal isOpen={showConnectedSites} onClose={() => setShowConnectedSites(false)} />
            <PrivateKeyForm isVisible={showPrivateKeyForm} toggleVisibility={togglePrivateKeyForm} />
        </HStack>
    )
}

export default Header