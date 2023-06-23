import { HStack, Text, VStack, Button } from 'native-base'
import React, { useState } from 'react'
import {View, Pressable} from "react-native"

import styles from "../../styles/authentication/confirmMnemonic"

type Props = {}

const sampleMnemonic = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function ConfirmMnemonic({}: Props) {
  const [mnemonic, setMnemonic] = useState<string[]>([])
  
  const handleWordSelection = (word: string) => {
    let _mnemonic = mnemonic.slice()

    if(_mnemonic.includes(word)) {
        _mnemonic = _mnemonic.filter(el => el !== word)
    } else {
        _mnemonic.push(word)
    }

    setMnemonic(_mnemonic)
  }
  return (
    <View style={styles.container}>
        <View>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack space={2} alignItems="center">
            <Text fontSize="xl">Confirm Secret Recovery Phrase</Text>
            <Text>Select each phrase in order</Text>

            <View style={styles.mnemonicWrapper}>
                {mnemonic.map(word => <Text>{word}</Text>)}
            </View>

            <View  style={styles.mnemonicWrapper}>
                {sampleMnemonic.map(word => (
                    <Pressable onPress={() => handleWordSelection(word)}>
                        <Text style={mnemonic.includes(word)? styles.selectedWord : styles.word}>{word}</Text>
                    </Pressable>
                ))}
            </View>

            <Button>Confirm</Button>
        </VStack>
    </View>
  )
}

export default ConfirmMnemonic