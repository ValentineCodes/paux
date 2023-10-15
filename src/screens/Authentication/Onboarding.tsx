import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Image, Text } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { useNavigation } from '@react-navigation/native'

type Props = {}

export default function Onboarding({ }: Props) {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Image source={require("../../images/eth-icon.png")} alt='Pocket' style={{ width: Dimensions.get("window").width * 0.7, height: Dimensions.get("window").width * 0.7 }} />
            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" bold>Welcome to Pocket Wallet</Text>
            <Text textAlign="center" fontSize="md" my="4">A safe and secure crypto wallet to manage funds, interact with Dapps, sign transactions and more</Text>

            <Button text="Get Started" onPress={() => navigation.navigate("WalletSetup")} style={{ marginTop: 40 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,
        paddingTop: 50,
        backgroundColor: 'white'
    }
})