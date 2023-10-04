import { HStack, Modal, Text } from 'native-base';
import React from 'react'
import { Pressable, FlatList } from 'react-native';
import { ConnectedSite, removeConnectedSite } from '../../store/reducers/ConnectedSites';
import { useDispatch, useSelector } from 'react-redux';
import { web3wallet } from '../../utils/Web3WalletClient';
import { getSdkError } from '@walletconnect/utils';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConnectedSitesModal({ isOpen, onClose }: Props) {
    const dispatch = useDispatch()

    const connectedSites: ConnectedSite[] = useSelector(state => state.connectedSites)

    const disconnectSession = async (site: ConnectedSite) => {
        dispatch(removeConnectedSite(site.name))
        try {
            await web3wallet.disconnectSession({
                topic: site.topic,
                reason: getSdkError("USER_DISCONNECTED")
            })
        } catch (error) {
            return
        }
    }
    return isOpen && (
        <Modal isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Connected Sites</Modal.Header>
                <FlatList
                    keyExtractor={item => item.name}
                    data={connectedSites}
                    renderItem={({ item }) => <HStack space={4} mb={4}>
                        <Text>{item.name}</Text>
                        <Pressable onPress={() => disconnectSession(item)}><Text color="blue.400" bold>Disconnect</Text></Pressable>
                    </HStack>}
                />
            </Modal.Content >
        </Modal>
    )
}