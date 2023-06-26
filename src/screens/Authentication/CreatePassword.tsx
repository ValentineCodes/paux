import { HStack, Switch, Text, VStack, View, Button } from 'native-base'
import React, { useCallback, useState } from 'react'

import styles from "../../styles/authentication/createPassword"
import { useNavigation } from '@react-navigation/native'
import PasswordInput from '../../components/forms/PasswordInput'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginUser } from '../../store/reducers/Auth'

type Props = {}

function CreatePassword({}: Props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)

    const confirmationMessage = useCallback(() => {
        if(confirmPassword) {
            if(password === confirmPassword) {
                return <Text color="green.500">Passwords match</Text>
            } else {
                return <Text color="red.500">Passwords do not match</Text>
            }
        }
    }, [confirmPassword])

    const createPassword = async () => {
        if(!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        if(password !== confirmPassword) {
            toast.show("Passwords do not match!", {
                type: "danger"
            })
            return
        }

        const security = {
            password,
            isBiometricsEnabled
        }

        AsyncStorage.setItem("security", JSON.stringify(security))
        dispatch(loginUser())

        toast.show("User logged in!")
    }
  return (
    <View style={styles.container}>
        <View style={styles.logo}>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack alignItems="center" marginTop={50}>
            <Text fontSize="xl" bold>Create Password</Text>
            <Text style={styles.contentCaption}>This will unlock your pocket only on this device</Text>
        </VStack>

        <VStack space={5}>
            <PasswordInput label="Password" onChange={setPassword} />
            <PasswordInput label="Confirm Password" onChange={setConfirmPassword} />
        </VStack>
        {confirmationMessage()}

        <HStack alignItems="center" space={2} marginTop={5}>
            <Text fontSize="md">Sign in with Biometrics</Text>
            <Switch size="md" colorScheme="primary" isChecked={isBiometricsEnabled} onToggle={value => setIsBiometricsEnabled(value)} />
        </HStack>

        <Button marginTop={5} onPress={createPassword}>Create Password</Button>
    </View>
  )
}

export default CreatePassword