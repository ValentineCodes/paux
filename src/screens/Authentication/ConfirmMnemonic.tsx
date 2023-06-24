import { HStack, Text, VStack, Button } from 'native-base'
import React, { useEffect, useState } from 'react'
import {View, Pressable} from "react-native"

import styles from "../../styles/authentication/confirmMnemonic"
import { useNavigation } from '@react-navigation/native'
import { shuffleArray } from '../../utils/helperFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {}

function ConfirmMnemonic({}: Props) {
  const navigation = useNavigation()
  const [mnemonic, setMnemonic] = useState<string[]>([])
  const [shuffledMnemonic, setShuffledMnemonic] = useState<string[]>([])
  
  const handleWordSelection = (word: string) => {
    let _mnemonic = mnemonic.slice()

    if(_mnemonic.includes(word)) {
        _mnemonic = _mnemonic.filter(el => el !== word)
    } else {
        _mnemonic.push(word)
    }

    setMnemonic(_mnemonic)
  }

  useEffect(() => {
    (async () => {
        const mnemonic = await AsyncStorage.getItem("mnemonic")
        if(mnemonic) {
            const _mnemonic: string[] = mnemonic.split(" ")
            const shuffledMnemonic = shuffleArray(_mnemonic)
            setShuffledMnemonic(shuffledMnemonic)
        }
    })()
  }, [])
  
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
                {shuffledMnemonic.map(word => (
                    <Pressable onPress={() => handleWordSelection(word)}>
                        <Text style={mnemonic.includes(word)? styles.selectedWord : styles.word}>{word}</Text>
                    </Pressable>
                ))}
            </View>

            <Button onPress={() => navigation.navigate("CreatePassword")}>Confirm</Button>
        </VStack>
    </View>
  )
}

export default ConfirmMnemonic