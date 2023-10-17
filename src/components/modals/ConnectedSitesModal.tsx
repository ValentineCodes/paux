import { HStack, Text, VStack, Icon, Divider } from 'native-base';
import React from 'react'
import { Pressable, FlatList } from 'react-native';
import { ConnectedSite, removeConnectedSite } from '../../store/reducers/ConnectedSites';
import { useDispatch, useSelector } from 'react-redux';
import { web3wallet } from '../../utils/Web3WalletClient';
import { getSdkError } from '@walletconnect/utils';
import { removeSession } from '../../store/reducers/ActiveSessions';
import Modal from "react-native-modal"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { FONT_SIZE } from '../../utils/styles';

type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function ConnectedSitesModal({ isVisible, onClose }: Props) {
    const dispatch = useDispatch()

    const connectedSites: ConnectedSite[] = useSelector(state => state.connectedSites)

    const disconnectSession = async (site: ConnectedSite) => {
        dispatch(removeConnectedSite(site.name))
        dispatch(removeSession(site.name))
        if (connectedSites.length === 1) {
            onClose()
        }
        try {
            await web3wallet.disconnectSession({
                topic: site.topic,
                reason: getSdkError("USER_DISCONNECTED")
            })
        } catch (error) {
            return
        }
    }
    return (
        <Modal isVisible={isVisible} animationIn="slideInRight" animationOut="slideOutLeft" onBackButtonPress={onClose} onBackdropPress={onClose}>
            <VStack bgColor="white" borderRadius="20" p="5" space={2} maxH="50%">
                <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={FONT_SIZE['xl']} bold>Connected sites</Text>
                    <Icon as={<Ionicons name="close-outline" />} size={1.5 * FONT_SIZE['xl']} onPress={onClose} />
                </HStack>

                <Divider bgColor="muted.300" my="2" />

                {connectedSites.length === 0 ? (
                    <Text textAlign="center" fontSize={FONT_SIZE['lg']}>No connected sites</Text>
                ) : (
                    <FlatList
                        keyExtractor={item => item.name}
                        data={connectedSites}
                        renderItem={({ item }) => (
                            <HStack space={4} py="2" alignItems="center" justifyContent="space-between">
                                <Text fontSize={FONT_SIZE['lg']} fontWeight="medium" w="60%">{item.name}</Text>
                                <Pressable onPress={() => disconnectSession(item)}><Text color="blue.500" fontWeight="semibold" fontSize={FONT_SIZE['lg']}>Disconnect</Text></Pressable>
                            </HStack>
                        )}
                        ItemSeparatorComponent={<Divider bgColor="muted.100" my="2" />}
                    />
                )}
            </VStack>
        </Modal>
    )
}