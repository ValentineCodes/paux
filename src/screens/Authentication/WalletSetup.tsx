import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { ScrollView, Image, Text, Icon } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/dist/Ionicons"

type Props = {}

export default function WalletSetup({ }: Props) {
    const navigation = useNavigation()
    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }} style={styles.container}>
            <Icon as={<Ionicons name="arrow-back-outline" />} size={7} color="black" style={styles.navBtn} onPress={() => navigation.goBack()} />
            <Image source={require("../../assets/icons/wallet_icon.png")} alt='Pocket' style={{ width: Dimensions.get("window").width * 0.6, height: Dimensions.get("window").width * 0.6 }} />
            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" bold mt="10">Wallet Setup</Text>
            <Text textAlign="center" fontSize="md" my="4">Create your new Wallet or import using a seed phrase if you already have an account</Text>

            <Button text="Create a New Wallet" onPress={() => navigation.navigate("CreatePassword")} style={{ marginTop: 40 }} />
            <Button text="Import Using Seed Phrase" type="outline" onPress={() => navigation.navigate("ImportWallet")} style={{ marginTop: 20 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    navBtn: {
        position: "absolute",
        top: 15,
        left: 15
    }
})