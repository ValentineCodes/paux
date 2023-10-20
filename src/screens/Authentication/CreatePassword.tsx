import { HStack, Switch, Text, VStack, ScrollView, Divider, View } from 'native-base'
import React, { useState } from 'react'

import styles from "../../styles/authentication/createPassword"
import { useNavigation } from '@react-navigation/native'
import PasswordInput from '../../components/forms/PasswordInput'
import { useDispatch } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import SInfo from "react-native-sensitive-info";

import { COLORS } from '../../utils/constants'
import Button from '../../components/Button'
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import { FONT_SIZE } from '../../utils/styles'

type Props = {}

function CreatePassword({ }: Props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const toast = useToast()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const createPassword = async () => {
        if (!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        if (password.length < 8) {
            toast.show("Password must be at least 8 characters", {
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

        try {
            setIsCreating(true)

            const security = {
                password,
                isBiometricsEnabled
            }

            await SInfo.setItem("security", JSON.stringify(security), {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            });

            navigation.navigate("SecureWallet")
        } catch (error) {
            toast.show("Failed to create password. Please try again", {
                type: "danger"
            })
        } finally {
            setIsCreating(false)
        }
    }
    return (
        <View style={styles.container}>
            <ProgressIndicatorHeader progress={1} />

            <Divider bgColor="muted.100" my="8" />

            <ScrollView flex="1">
                <Text textAlign="center" color={COLORS.primary} fontSize={1.7 * FONT_SIZE["xl"]} bold>Create Password</Text>
                <Text textAlign="center" fontSize={FONT_SIZE['lg']} my="2">This password will unlock your Pocket wallet only on this device</Text>

                <VStack space={6} mb="50" mt="4">
                    <PasswordInput label="New Password" value={password} infoText={password.length < 8 && 'Must be at least 8 characters'} onChange={setPassword} />
                    <PasswordInput label="Confirm New Password" value={confirmPassword} infoText={password && confirmPassword && password !== confirmPassword && 'Password must match'} onChange={setConfirmPassword} />

                    <Divider bgColor="muted.100" />

                    <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize={FONT_SIZE['xl']}>Sign in with Biometrics</Text>
                        <Switch size="md" trackColor={{ true: COLORS.primary, false: "#E5E5E5" }} isChecked={isBiometricsEnabled} onToggle={setIsBiometricsEnabled} />
                    </HStack>

                    <Divider bgColor="muted.100" />

                    <Button text="Import" loading={isCreating} onPress={createPassword} />
                </VStack>
            </ScrollView>
        </View>
    )
}

export default CreatePassword