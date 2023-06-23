import { Center, Text, VStack, Button } from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"

import  styles from "../../styles/authentication/generateMnemonic"
import { useNavigation } from '@react-navigation/native'

type Props = {}

const mnemonic = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
function GenerateMnemonic({}: Props) {
    const navigation = useNavigation()
    const [showMnemonic, setShowMnemonic] = useState(false)
  return (
    <View style={styles.container}>
        <View>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack space={5} alignItems="center">
            <Text fontSize="xl" bold>Your Secret Recovery Phrase</Text>
            <Text textAlign="center">This is your secret recovery phrase. You'll be asked to re-enter this on the next step. WRITE IT DOWN!</Text>

            <Center style={{backgroundColor: "grey", height: 200}}>
                <View style={styles.mnemonicWrapper}>
                    {mnemonic.map(word => <Text>{word}</Text>)}
                </View>

                {!showMnemonic && (
                <VStack space={4} style={styles.mnemonicMask}>
                    <MaterialIcons name="visibility-off" style={{color: "white", fontSize: 30}}/>
                    <Text bold color="white">Tap to reveal your Secret Recovery Phrase</Text>
                    <Text color="grey">Mask sure no one is watching your screen</Text>
                    <Button variant="outline" onPress={() => setShowMnemonic(true)}>Reveal</Button>
                </VStack>
                )}
            </Center>

            <Button onPress={() => navigation.navigate("ConfirmMnemonic")}>Continue</Button>
        </VStack>

    </View>
  )
}

export default GenerateMnemonic