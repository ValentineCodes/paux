import React from 'react'
import { View, Text, VStack, Button, Center } from 'native-base'

import globalStyles from "../../styles/global"
import styles from "../../styles/onboarding"

type Props = {}

const Onboarding = (props: Props) => {
  return (
    <View style={styles.container}>
        <View style={styles.logo}>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack space={10} alignItems="center" marginTop={50}>
            <Text fontSize="xl" bold>First time?</Text>
            
            <Center style={styles.contentCard}>
                <Text fontSize="md" bold>Yeah, get me started!</Text>
                <Text style={styles.contentCaption}>This will create a new wallet, secret recovery phrase and a new password for your pocket</Text>
                <Button>Get started!</Button>
            </Center>

            <Center style={styles.contentCard}>
                <Text fontSize="md" bold>Nope, I've got a secret recovery phrase</Text>
                <Text style={styles.contentCaption}>Import your wallet and create a new password for your pocket</Text>
                <Button variant="outline">Import it!</Button>
            </Center>
        </VStack>
    </View>
  )
}

export default Onboarding