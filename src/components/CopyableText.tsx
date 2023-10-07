import { HStack, Text, Icon } from 'native-base'
import React from 'react'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import { StyleSheet } from 'react-native';

type Props = {
    value: string;
    displayText?: string;
}

export default function CopyableText({ value, displayText }: Props) {
    const toast = useToast()

    const copy = () => {
        Clipboard.setString(value)
        toast.show("Copied to clipboard")
    }
    return (
        <HStack alignItems="center" space={1}>
            <Text>{displayText || value}</Text>
            <Icon as={<Ionicons name="copy-outline" />} size={5} color="muted.400" onPress={copy} />
        </HStack>
    )
}