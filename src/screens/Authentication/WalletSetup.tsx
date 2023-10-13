import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Image, Text, Icon } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"

type Props = {}

export default function WalletSetup({ }: Props) {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Icon as={<Ionicons name="arrow-back-outline" />} size={7} color="black" style={styles.navBtn} onPress={() => navigation.goBack()} />
            <Image source={require("../../images/eth-icon.png")} alt='Pocket' style={{ width: 300, height: 300 }} />
            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" bold>Wallet Setup</Text>
            <Text textAlign="center" fontSize="md" my="4">Create your new Wallet or import using a seed phrase if you already have an account</Text>

            <Button text="Create a New Wallet" onPress={() => navigation.navigate("CreateWallet")} style={{ marginTop: 40 }} />
            <Button text="Import Using Seed Phrase" type="outline" onPress={() => navigation.navigate("ImportWallet")} style={{ marginTop: 20 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,
        paddingTop: 100,
        backgroundColor: 'white'
    },
    navBtn: {
        position: "absolute",
        top: 15,
        left: 15
    }
})