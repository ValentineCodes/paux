import { Button, Center, Text } from 'native-base'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import PasswordInput from '../../components/forms/PasswordInput'
import { useToast } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

type Props = {}

function Login({}: Props) {
    const toast = useToast()
    const navigation = useNavigation()

    const [password, setPassword] = useState("")

    const unlockWithPassword = async () => {
        if(!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        const _security = await AsyncStorage.getItem("security")
        const security = JSON.parse(_security!)

        if(password !== security.password) {
            toast.show("Incorrect password!", {
                type: "danger"
            })
            return
        }

        navigation.navigate("Home")
    }

    const unlockWithBiometrics = async () => {
        const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true})

        try {
            const signInWithBio = async () => {
                let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
                let payload = epochTimeSeconds + 'some message'
    
                try {
                    const response = await rnBiometrics.createSignature({
                        promptMessage: 'Sign in',
                        payload: payload
                    })
        
                    if(response.success) {
                        navigation.navigate("Home")
                    }
                } catch(error) {
                    return
                }

            }
    
            const { available } = await rnBiometrics.isSensorAvailable()

            if (available) {
                const { keysExist } = await rnBiometrics.biometricKeysExist()

                if(!keysExist) {
                    await rnBiometrics.createKeys()
                }

                signInWithBio()
            }
        } catch(error) {
            toast.show("Could not sign in with biometrics", {
                type: "danger"
            })
            console.error(error)
        }
    }
  return (
    <Center>
        <Text fontSize="2xl" bold>Welcome Back</Text>
        <PasswordInput label="Password" onChange={setPassword} />
        <Button marginTop={5} onPress={unlockWithPassword}>UNLOCK WITH PASSWORD</Button>
        <Button variant="outline" marginTop={5} onPress={unlockWithBiometrics}>UNLOCK WITH BIOMETRICS</Button>
    </Center>
  )
}

export default Login