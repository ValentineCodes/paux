import React, { useState } from 'react'
import { Dimensions } from "react-native"
import { Icon, Text, VStack, HStack, Button as RNButton } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';

import { Account, removeAccount } from '../../store/reducers/Accounts';
import EditAccountNameForm from '../forms/EditAccountNameForm';
import { useNavigation } from '@react-navigation/native';
import CopyableText from '../CopyableText';
import Modal from "react-native-modal"
import Blockie from '../Blockie';
import { FONT_SIZE } from '../../utils/styles';
import Button from '../Button';


type Props = {
    isVisible: boolean;
    onClose: () => void;
}

export default function AccountDetailsModal({ isVisible, onClose }: Props) {

    const navigation = useNavigation()

    const dispatch = useDispatch()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [isEditingAccountName, setIsEditingAccountName] = useState(false)
    const [showRemoveAccountConsentModal, setShowRemoveAccountConsentModal] = useState(false)

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

    const handleAccountRemoval = () => {
        dispatch(removeAccount(connectedAccount.address))
        handleOnClose()
    }
    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={handleOnClose} onBackdropPress={handleOnClose}>
            <VStack bgColor="white" borderRadius="20" p="5" alignItems="center" space="4" w="full">
                {
                    isEditingAccountName ? <EditAccountNameForm close={() => setIsEditingAccountName(false)} /> : (
                        <VStack alignItems="center" space="2">
                            <Blockie address={connectedAccount.address} size={2.5 * FONT_SIZE['xl']} />
                            <HStack alignItems="center" space="2">
                                <Text fontSize={FONT_SIZE['xl']} bold>{connectedAccount.name}</Text>
                                <Icon as={<Ionicons name="create-outline" />} size={1.5 * FONT_SIZE['xl']} color="muted.400" onPress={() => setIsEditingAccountName(true)} />
                            </HStack>
                        </VStack>
                    )
                }
                <QRCode value={connectedAccount.address} size={12 * FONT_SIZE['xl']} />
                <CopyableText value={connectedAccount.address} />

                <Button type="outline" text="Show private key" onPress={showPrivateKey} />

                {accounts.length > 1 && <RNButton py="4" borderRadius={25} bgColor="red.100" w="full" onPress={() => setShowRemoveAccountConsentModal(true)}><Text color="red.400" bold fontSize="md">Remove account</Text></RNButton>}
            </VStack>

            <Modal isVisible={showRemoveAccountConsentModal} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={() => setShowRemoveAccountConsentModal(false)} onBackdropPress={() => setShowRemoveAccountConsentModal(false)}>
                <VStack bgColor="white" borderRadius="40" px="7" py="5" alignItems="center" space="4">
                    <Icon as={<Ionicons name="warning-outline" />} size={Dimensions.get("window").height * 0.17} color="red.400" />
                    <Text color="red.400" bold fontSize={1.5 * FONT_SIZE['xl']} textAlign="center">Remove account</Text>
                    <Text fontSize={FONT_SIZE['xl']} textAlign="center">This action cannot be reversed. Are you sure you want to go through with this?</Text>

                    <HStack w="full" mt="5" alignItems="center" justifyContent="space-between">
                        <RNButton py="4" bgColor="red.100" w="50%" onPress={() => setShowRemoveAccountConsentModal(false)}><Text color="red.400" bold fontSize="md">Cancel</Text></RNButton>
                        <RNButton py="4" bgColor="red.400" w="50%" onPress={handleAccountRemoval}><Text color="white" bold fontSize="md">Remove account</Text></RNButton>
                    </HStack>
                </VStack>
            </Modal>
        </Modal>
    )
}