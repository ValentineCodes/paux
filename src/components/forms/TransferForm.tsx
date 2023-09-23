import React, { useState } from 'react'
import { Overlay } from '@rneui/themed';
import { Icon, Input, Pressable, Button, Text } from 'native-base';
import Ionicons from "react-native-vector-icons/dist/Ionicons"

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

type Props = {
    isVisible: boolean;
    toggleVisibility: () => void;
}

export default function TransferForm({ isVisible, toggleVisibility }: Props) {
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState("")

    return (
        <Overlay isVisible={isVisible} onBackdropPress={toggleVisibility}>
            <Input w={{
                base: "100%",
                md: "25%"
            }} type="text" placeholder='address' InputRightElement={<Pressable>
                <Icon as={<Ionicons name="scan-outline" />} size={5} mr="2" color="muted.400" />
            </Pressable>} onChangeText={value => setAddress(value)} />
            {address.length !== 0 && !ethers.utils.isAddress(address) && <Text style={{ color: "red" }}>Invalid address</Text>}

            <Input w={{
                base: "100%",
                md: "25%"
            }} placeholder='amount' onChangeText={value => setAmount(value)} />

            <Button>Send</Button>
        </Overlay>
    )
}