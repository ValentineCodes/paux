import { Button, Center, Text } from 'native-base'
import React, { useState, useEffect } from 'react'
import PasswordInput from '../../components/forms/PasswordInput'
import { useToast } from 'react-native-toast-notifications'
import { useNavigation } from '@react-navigation/native'
import ReactNativeBiometrics from 'react-native-biometrics'
import SInfo from "react-native-sensitive-info";

type Props = {}

function Login({ }: Props) {
    const toast = useToast()
    const navigation = useNavigation()

    const [password, setPassword] = useState("")

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

        navigation.navigate("Home")
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
                        navigation.navigate("Home")
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
        unlockWithBiometrics()
    }, [])
    return (
        <Center>
            <Text fontSize="2xl" bold>Welcome Back</Text>
            <PasswordInput label="Password" onChange={setPassword} />
            <Button marginTop={5} onPress={password ? unlockWithPassword : unlockWithBiometrics}>{password ? "SIGN IN" : "SIGN IN WITH BIOMETRICS"}</Button>
        </Center>
    )
}

export default Login