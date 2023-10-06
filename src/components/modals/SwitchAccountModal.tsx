import { FlatList, HStack, Modal, Text } from 'native-base';
import { Pressable } from "react-native"
import React from 'react'
import { ActiveSession, switchSessionAccount } from '../../store/reducers/ActiveSessions';
import { useDispatch, useSelector } from 'react-redux';
import { web3wallet } from '../../utils/Web3WalletClient';
import { SessionTypes } from '@walletconnect/types';
import { useToast } from 'react-native-toast-notifications';
import { Account } from '../../store/reducers/Accounts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function SwitchAccountModal({ isOpen, onClose }: Props) {
    const activeSessions: ActiveSession[] = useSelector(state => state.activeSessions)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const toast = useToast()

    const dispatch = useDispatch()

    const switchAccount = async (session: ActiveSession) => {
        const newNamespaces: SessionTypes.Namespaces = {}
        let accounts: string[] = []
        Object.keys(session.requiredNamespaces).forEach(key => {
            session.requiredNamespaces[key].chains.forEach(chain => {
                accounts.push(`${chain}:${connectedAccount.address}`);
            });

            newNamespaces[key] = {
                accounts,
                methods: session.requiredNamespaces[key].methods,
                events: session.requiredNamespaces[key].events
            }
        })

        try {
            await web3wallet.updateSession({
                topic: session.topic,
                namespaces: newNamespaces
            })

            toast.show("Account switched", {
                type: "success"
            })

            const sessionUpdate = {
                site: session.site,
                account: connectedAccount.address
            }

            dispatch(switchSessionAccount(sessionUpdate))
        } catch (error) {
            toast.show("Failed to switch network", {
                type: "danger"
            })
        }
    }

    return isOpen && (
        <Modal isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Switch account</Modal.Header>
                <Pressable><Text color="blue.400" bold p="2">Switch all</Text></Pressable>
                <FlatList
                    data={activeSessions.filter(session => session.account !== connectedAccount.address)}
                    keyExtractor={item => item.site}
                    renderItem={({ item }) => (
                        <HStack alignItems="center" justifyContent="space-between" px="2" py="4">
                            <Text>{item.site}</Text>
                            <Pressable onPress={() => switchAccount(item)}><Text color="blue.400" bold>Switch</Text></Pressable>
                        </HStack>
                    )}
                />
            </Modal.Content>
        </Modal>
    )
}