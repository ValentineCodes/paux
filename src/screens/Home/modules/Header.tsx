import { Text, Select, CheckIcon, HStack, Icon, Image } from 'native-base'
import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Network, switchNetwork } from '../../../store/reducers/Networks'
import { Account, switchAccount } from '../../../store/reducers/Accounts'
import { Pressable, Linking, StyleSheet } from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons"
import Share from 'react-native-share';
import { SignClientTypes, SessionTypes } from '@walletconnect/types';
import Blockie from '../../../components/Blockie'

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AccountDetailsModal from '../../../components/modals/AccountDetailsModal'
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
import { FONT_SIZE } from '../../../utils/styles'
import { COLORS } from '../../../utils/constants'
import AccountsModal from '../../../components/modals/AccountsModal'

type Props = {}

export default function Header({ }: Props) {
    const dispatch = useDispatch()
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)
    const [showPrivateKeyForm, setShowPrivateKeyForm] = useState(false)
    const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false)
    const [showConnectedSites, setShowConnectedSites] = useState(false)
    const [showAccountSelection, setShowAccountSelection] = useState(false)
    const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false)
    const [showSignModal, setShowSignModal] = useState(false)
    const [showSignTypedDataModal, setShowSignTypedDataModal] = useState(false)
    const [showSendTransactionModal, setShowSendTransactionModal] = useState(false)

    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [isPairing, setIsPairing] = useState(false)
    const [isApprovingSession, setIsApprovingSession] = useState(false)
    const [proposal, setProposal] =
        useState<SignClientTypes.EventArguments['session_proposal']>();

    const [requestEventData, setRequestEventData] = useState();
    const [requestSession, setRequestSession] = useState();

    const [selectedAccount, setSelectedAccount] = useState<string>("")

    const networks: Network[] = useSelector(state => state.networks)
    const connectedNetwork: Network = useSelector(state => state.networks.find((network: Network) => network.isConnected))

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const activeSessions: ActiveSession[] = useSelector(state => state.activeSessions)

    const toast = useToast()

    const handleNetworkSelecttion = (chainId: string) => {
        dispatch(switchNetwork(chainId))
    }

    const togglePrivateKeyForm = () => {
        setShowPrivateKeyForm(!showPrivateKeyForm)
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

            if (accounts.length > 1) {
                setShowAccountSelection(true)
            } else {
                setSelectedAccount(connectedAccount.address)
                setShowApprovalModal(true)
            }
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

            setIsApprovingSession(true)

            try {
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

                if (connectedAccount.address !== selectedAccount) {
                    dispatch(switchAccount(selectedAccount))
                }

                dispatch(addSession(activeSession))
                dispatch(addConnectedSite(connectedSite))

                handleDeepLinkRedirect(sessionMetadata?.redirect);
            } catch (error) {
                console.error(error)
                return
            } finally {
                setIsApprovingSession(false)
            }
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
        <HStack alignItems="center" justifyContent="space-between" py="4" borderBottomColor="#ccc">
            <Image source={require("../../../assets/images/pocket.png")} alt="Pocket" style={styles.logo} />

            <Select selectedValue={connectedNetwork.chainId.toString()} flex="1" borderRadius={25} mx="10" accessibilityLabel="Choose Network" placeholder="Choose Network" _selectedItem={{
                bg: COLORS.primary,
                endIcon: <CheckIcon size={5} color="white" />
            }} dropdownIcon={<Icon as={<Ionicons name="chevron-down" />} size={1.3 * FONT_SIZE['xl']} color="black" mr="2" />} fontSize={FONT_SIZE['md']} onValueChange={handleNetworkSelecttion}>
                {networks.map((network: Network) => <Select.Item key={network.chainId} label={network.name} value={network.chainId.toString()} />)}
            </Select>

            <HStack alignItems="center" space={6}>
                <Pressable onPress={() => setShowConnectModal(true)}>
                    <Icon as={<MaterialCommunityIcons name="qrcode-scan" />} size={1.3 * FONT_SIZE['xl']} color="black" />
                </Pressable>

                <Menu>
                    <MenuTrigger><Blockie address={connectedAccount.address} size={1.7 * FONT_SIZE["xl"]} /></MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => setIsAccountModalVisible(true)} style={styles.menuOption}>
                            <Icon as={<Ionicons name="layers-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                            <Text fontSize={FONT_SIZE['lg']}>Accounts</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => setShowAccountDetailsModal(true)} style={styles.menuOption}>
                            <Icon as={<Ionicons name="grid-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                            <Text fontSize={FONT_SIZE['lg']}>Account details</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => setShowConnectedSites(true)} style={styles.menuOption}>
                            <Icon as={<Ionicons name="radio-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                            <Text fontSize={FONT_SIZE['lg']}>Connected sites</Text>
                        </MenuOption>
                        <MenuOption onSelect={shareAddress} style={styles.menuOption}>
                            <Icon as={<Ionicons name="share-social-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                            <Text fontSize={FONT_SIZE['lg']}>Share address</Text>
                        </MenuOption>
                        {connectedNetwork.blockExplorer && <MenuOption onSelect={viewOnBlockExplorer} style={styles.menuOption}>
                            <Icon as={<Ionicons name="open-outline" />} size={1.2 * FONT_SIZE['xl']} color="black" mr="2" />
                            <Text fontSize={FONT_SIZE['lg']}>View on block explorer</Text>
                        </MenuOption>}
                    </MenuOptions>
                </Menu>
            </HStack>

            <ConnectModal isOpen={showConnectModal} isPairing={isPairing} onClose={() => setShowConnectModal(false)} pair={pair} />
            <ApprovalModal proposal={proposal} isOpen={showApprovalModal} isApproving={isApprovingSession} onClose={() => setShowApprovalModal(false)} handleAccept={handleAcceptProposal} handleReject={handleRejectProposal} />

            <AccountsModal isVisible={isAccountModalVisible} setVisibility={setIsAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} onSelect={(account) => {
                const canSwitchSessionAccount = activeSessions.some(session => session.account !== account)

                if (canSwitchSessionAccount) {
                    setShowSwitchAccountModal(true)
                }
            }} />

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
            <AccountDetailsModal isVisible={showAccountDetailsModal} onClose={() => setShowAccountDetailsModal(false)} />
            <ConnectedSitesModal isOpen={showConnectedSites} onClose={() => setShowConnectedSites(false)} />
        </HStack>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 1.7 * FONT_SIZE["xl"],
        height: 1.7 * FONT_SIZE["xl"],
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
    }
})