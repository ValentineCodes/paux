import { HStack, Switch, Text, VStack, View, Button } from 'native-base'
import React, { useState } from 'react'

import styles from "../../styles/authentication/createPassword"
import { useNavigation } from '@react-navigation/native'
import PasswordInput from '../../components/forms/PasswordInput'

type Props = {}

function CreatePassword({}: Props) {
    const navigation = useNavigation()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false)
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

        <HStack alignItems="center" space={2} marginTop={5}>
            <Text fontSize="md">Sign in with Biometrics</Text>
            <Switch size="md" colorScheme="primary" isChecked={isBiometricsEnabled} onToggle={value => setIsBiometricsEnabled(value)} />
        </HStack>

        <Button marginTop={5}>Create Password</Button>
    </View>
  )
}

export default CreatePassword