import React from 'react'
import Modal from "react-native-modal"

type Props = {
    title: string;
    subTitle: string;
    isVisible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export default function ConsentModal({ title, subTitle, isVisible, onClose, onAccept }: Props) {
    return (
        <Modal isVisible={isVisible} animationIn="zoomIn" animationOut="zoomOut" onBackButtonPress={onClose} onBackdropPress={onClose}>

        </Modal>
    )
}