import React, { useState } from 'react'
import { Icon, Input, Pressable, Modal, Button } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import QRCodeScanner from './QRCodeScanner';

type Props = {
    isOpen: boolean;
    isPairing: boolean;
    onClose: () => void;
    pair: (uri: string) => void;
}

export default function ConnectModal({ isOpen, isPairing, onClose, pair }: Props) {
    const [wcuri, setwcuri] = useState("")
    const [isScanningCode, setIsScanningCode] = useState(false)
    return isOpen && (
        <Modal isOpen onClose={onClose}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Connect to DApp</Modal.Header>
                <Modal.Body>
                    <Input w={{
                        base: "100%",
                        md: "25%"
                    }} type="text" value={wcuri} placeholder='Paste the WalletConnect URI here...' InputRightElement={<Pressable onPress={() => setIsScanningCode(true)}>
                        <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
                    </Pressable>} onChangeText={value => setwcuri(value)} />

                    <Button onPress={() => {
                        pair(wcuri)
                    }} isLoading={isPairing} isLoadingText='Pairing' disabled={isPairing}>Connect</Button>
                </Modal.Body>
            </Modal.Content>

            <QRCodeScanner isOpen={isScanningCode} onClose={() => setIsScanningCode(false)} onReadCode={wcuri => {
                pair(wcuri)
                setIsScanningCode(false)
            }} />
        </Modal>
    )
}