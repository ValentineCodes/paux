import { Image, Input, Text, VStack, Icon, Pressable } from 'native-base'
import React, { useState, useEffect } from 'react'
import { useToast } from 'react-native-toast-notifications'
import { useNavigation } from '@react-navigation/native'
import ReactNativeBiometrics from 'react-native-biometrics'
import SInfo from "react-native-sensitive-info";
import { createWeb3Wallet } from '../../utils/Web3WalletClient'
import { Dimensions, StyleSheet } from 'react-native'
import { FONT_SIZE } from '../../utils/styles'
import { COLORS } from '../../utils/constants'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"
import Button from '../../components/Button'

type Props = {}

export default function Login({ }: Props) {
    const toast = useToast()
    const navigation = useNavigation()

    const [password, setPassword] = useState("")
    const [isInitializing, setIsInitializing] = useState(false)

    const initWallet = async () => {
        try {
            setIsInitializing(true)
            await createWeb3Wallet()
            navigation.navigate("Home")
        } catch (error) {
            toast.show("Failed to initialize wallet", {
                type: "danger"
            })
        } finally {
            setIsInitializing(false)
        }
    }

    const unlockWithPassword = async () => {
        if (!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        const _security = await SInfo.getItem("security", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        });
        const security = JSON.parse(_security!)

        if (password !== security.password) {
            toast.show("Incorrect password!", {
                type: "danger"
            })
            return
        }

        await initWallet()

    }

    const unlockWithBiometrics = async () => {
        const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })

        try {
            const signInWithBio = async () => {
                let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
                let payload = epochTimeSeconds + 'some message'

                try {
                    const response = await rnBiometrics.createSignature({
                        promptMessage: 'Sign in',
                        payload: payload
                    })

                    if (response.success) {
                        await initWallet()
                    }
                } catch (error) {
                    return
                }

            }

            const { available } = await rnBiometrics.isSensorAvailable()

            if (available) {
                const { keysExist } = await rnBiometrics.biometricKeysExist()

                if (!keysExist) {
                    await rnBiometrics.createKeys()
                }

                signInWithBio()
            }
        } catch (error) {
            toast.show("Could not sign in with biometrics", {
                type: "danger"
            })
            console.error(error)
        }
    }

    useEffect(() => {
        // unlockWithBiometrics()
    }, [])
    return (
        <VStack style={styles.container} space={4}>
            <Image source={require("../../assets/images/pocket_logo.png")} alt='Pocket' style={{ width: Dimensions.get("window").height * 0.3, height: Dimensions.get("window").height * 0.3 }} />
            <Text fontSize={2 * FONT_SIZE['xl']} color={COLORS.primary} bold>Welcome Back!</Text>

            <VStack mt="5" space={2} w="full">
                <Text fontSize={FONT_SIZE['xl']} bold>Password</Text>
                <Input
                    value={password}
                    borderRadius="lg"
                    variant="filled"
                    fontSize="md"
                    focusOutlineColor={COLORS.primary}
                    InputLeftElement={
                        <Icon as={<MaterialIcons name="lock" />} size={5} ml="4" color="muted.400" />
                    }
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={setPassword}
                />
            </VStack>

            <Button text={password ? "SIGN IN" : "SIGN IN WITH BIOMETRICS"} onPress={password ? unlockWithPassword : unlockWithBiometrics} loading={isInitializing} style={{ marginTop: 10 }} />

            <Text fontSize={FONT_SIZE['lg']} textAlign="center">Wallet won't unlock? You can ERASE your current wallet and setup a new one</Text>

            <Pressable><Text fontSize={FONT_SIZE['xl']} color={COLORS.primary}>Reset Wallet</Text></Pressable>
        </VStack>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center"
    }
})