import { HStack, Text, Icon, Pressable } from 'native-base'
import React from 'react'
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import Clipboard from '@react-native-clipboard/clipboard';
import { useToast } from 'react-native-toast-notifications';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../utils/constants';

type Props = {
    value: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    iconStyle?: TextStyle;
    displayText?: string;
}

export default function CopyableText({ value, containerStyle, textStyle, iconStyle, displayText }: Props) {
    const toast = useToast()

    const copy = () => {
        Clipboard.setString(value)
        toast.show("Copied to clipboard", {
            type: "success"
        })
    }
    return (
        <Pressable onPress={copy}>
            <HStack alignItems="center" space={1} style={containerStyle}>
                <Text textAlign="center" fontWeight="medium" style={textStyle}>{displayText || value}</Text>
                <Icon as={<Ionicons name="copy" />} size={5} style={iconStyle} />
            </HStack>
        </Pressable>
    )
}