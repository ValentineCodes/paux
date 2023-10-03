import { HStack, Switch, Text, VStack, View, Button } from 'native-base'
import React, { useCallback, useState } from 'react'

import styles from "../../styles/authentication/createPassword"
import { useNavigation } from '@react-navigation/native'
import PasswordInput from '../../components/forms/PasswordInput'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import SInfo from "react-native-sensitive-info";

import { loginUser } from '../../store/reducers/Auth'
import { createWeb3Wallet } from '../../utils/Web3WalletClient'

type Props = {}

function CreatePassword({ }: Props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
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

    const confirmationMessage = useCallback(() => {
        if (password && confirmPassword) {
            if (password === confirmPassword) {
                return <Text color="green.500">Passwords match</Text>
            } else {
                return <Text color="red.500">Passwords do not match</Text>
            }
        }
    }, [password, confirmPassword])

    const createPassword = async () => {
        if (!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        if (password !== confirmPassword) {
            toast.show("Passwords do not match!", {
                type: "danger"
            })
            return
        }

        const security = {
            password,
            isBiometricsEnabled
        }

        await SInfo.setItem("security", JSON.stringify(security), {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        });
        dispatch(loginUser())

        await initWallet()
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

            <Button marginTop={5} onPress={createPassword} isLoading={isInitializing} isLoadingText='Initializing' disabled={isInitializing}>Create Password</Button>
        </View>
    )
}

export default CreatePassword