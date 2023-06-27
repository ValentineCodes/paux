import { HStack, Text, VStack, Button } from 'native-base'
import React, { useEffect, useState } from 'react'
import {View, Pressable, ScrollView} from "react-native"

import styles from "../../styles/authentication/confirmMnemonic"
import { useNavigation } from '@react-navigation/native'
import { shuffleArray } from '../../utils/helperFunctions'
import { useToast } from 'react-native-toast-notifications'
import SInfo from "react-native-sensitive-info";

type Props = {}

function ConfirmMnemonic({}: Props) {
  const navigation = useNavigation()
  const toast = useToast();
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

  const confirm = async () => {
    if(mnemonic.length !== 12) {
        toast.show("Incomplete mnemonic", {
            type: "warning"
        })
        return
    }

    try {
        const _mnemonic = await SInfo.getItem("mnemonic", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        });
        const selectedMnemonic = mnemonic.join(" ")
        if(_mnemonic === selectedMnemonic) {
            navigation.navigate("CreatePassword")
        } else {
            toast.show("Incorrect mnemonic order", {
                type: "danger"
            })
        }
    } catch(error) {
        console.log("Failed to get mnemonic")
        console.error(error)
    }
  }

  useEffect(() => {
    (async () => {
        const mnemonic = await SInfo.getItem("mnemonic", {
            sharedPreferencesName: "pocket.android.storage",
            keychainService: "pocket.ios.storage",
        });
        if(mnemonic) {
            const _mnemonic: string[] = mnemonic.split(" ")
            const shuffledMnemonic = shuffleArray(_mnemonic)
            setShuffledMnemonic(shuffledMnemonic)
        }
    })()
  }, [])
  
  return (
    <ScrollView style={styles.container}>
        <View>
            <Text fontSize="2xl" bold>Pocket</Text>
        </View>

        <VStack space={2} alignItems="center">
            <Text fontSize="xl">Confirm Secret Recovery Phrase</Text>
            <Text>Select each phrase in order</Text>

            <View style={styles.selectedMnemonic}>
                {mnemonic.map(word => <Text key={word} textAlign="center" style={[styles.word, {margin: 10, borderWidth: 0}]}>{word}</Text>)}
            </View>

            <View  style={[styles.mnemonicWrapper, {borderWidth: 0}]}>
                {shuffledMnemonic.map(word => (
                    <Pressable key={word} onPress={() => handleWordSelection(word)} style={{margin: 10, width: "33%"}}>
                        <Text textAlign="center" style={mnemonic.includes(word)? styles.selectedWord : styles.word}>{word}</Text>
                    </Pressable>
                ))}
            </View>

            <HStack space={2}>
                <Button variant="outline" borderColor="red.300" onPress={() => setMnemonic([])}>Clear</Button>
                <Button onPress={confirm}>Confirm</Button>
            </HStack>
        </VStack>
    </ScrollView>
  )
}

export default ConfirmMnemonic