import React, { useEffect } from 'react'
import { StyleSheet, Dimensions, BackHandler } from 'react-native'
import { ScrollView, Image, Text, VStack } from 'native-base'

import Button from '../../components/Button'
import { COLORS } from '../../utils/constants'
import { FONT_SIZE } from '../../utils/styles'
import { useNavigation } from '@react-navigation/native'

type Props = {}

export default function Onboarding({ }: Props) {
    const navigation = useNavigation()

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();

        return true;
    });

    useEffect(() => {
        return () => {
            backHandler.remove();
        };
    }, [])

    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }} style={styles.container}>
            <Image source={require("../../assets/images/pocket.png")} alt='Pocket' style={{ width: Dimensions.get("window").height * 0.3, height: Dimensions.get("window").height * 0.3 }} />
            <VStack w="full" mt="10">
                <Text textAlign="center" color={COLORS.primary} fontSize={2 * FONT_SIZE["xl"]} bold>Welcome to Pocket Wallet</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="4">A safe and secure crypto wallet to manage funds, interact with Dapps, sign transactions and more</Text>

                <Button text="Get Started" onPress={() => navigation.navigate("WalletSetup")} style={{ marginTop: 40, marginBottom: 50 }} />
            </VStack>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: 'white'
    }
})