import { VStack, Text, Button } from 'native-base'
import React from 'react'
import { View } from 'react-native'

import styles from "../../styles/authentication/importMnemonic"
import MnemonicInput from '../../components/forms/MnemonicInput'

type Props = {}

function ImportMnemonic({}: Props) {
  return (
    <View style={styles.container}>
        <View style={styles.logo}>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack space={10} alignItems="center" marginTop={50}>
            <Text fontSize="xl" bold>Your Secret Recovery Phrase</Text>
        </VStack>

        <MnemonicInput />
    </View>
  )
}

export default ImportMnemonic