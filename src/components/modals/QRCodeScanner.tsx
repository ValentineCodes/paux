import React from 'react'
import { Modal, Icon } from "native-base"
import { Camera } from 'react-native-camera-kit'
import { StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/dist/Ionicons"

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onReadCode: (value: string) => void;
}

export default function QRCodeScanner({ isOpen, onClose, onReadCode }: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Camera
                scanBarcode={true}
                onReadCode={(event) => {
                    onReadCode(event.nativeEvent.codeStringValue)
                }}
                showFrame={true}
                laserColor='blue'
                frameColor='white'
                style={styles.scanner}
            />
            <Icon as={<Ionicons name="close" />} size={10} mr="2" color="white" style={styles.closeIcon} onPress={onClose} />
        </Modal>
    )
}

const styles = StyleSheet.create({
    scanner: {
        width: '100%',
        height: '100%'
    },
    closeIcon: {
        position: 'absolute',
        top: 30,
        right: 15
    }
})