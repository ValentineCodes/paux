import { Center, Text, VStack, Button, HStack } from 'native-base'
import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import styles from "../../styles/authentication/generateMnemonic"
import { useNavigation } from '@react-navigation/native'
import SInfo from "react-native-sensitive-info";
import { useDispatch } from 'react-redux'
import { initAccount } from '../../store/reducers/Accounts'

type Props = {}

interface Wallet {
    mnemonic: string;
    privateKey: string;
    address: string;
}
function GenerateMnemonic({ }: Props) {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [wallet, setWallet] = useState<Wallet>()
    const [showMnemonic, setShowMnemonic] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const saveWallet = async () => {
        if (!wallet) return
        try {
            await SInfo.setItem("mnemonic", wallet.mnemonic, {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            });
            const _wallet = { privateKey: wallet.privateKey, address: wallet.address }
            await SInfo.setItem("accounts", JSON.stringify([_wallet]), {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            })

            dispatch(initAccount({ address: _wallet.address, fromMnemonic: true }))

            navigation.navigate("ConfirmMnemonic")
        } catch (error) {

        }
    }

    const generateNewWallet = () => {
        setTimeout(() => {
            const newWallet = ethers.Wallet.createRandom();
            const wallet = {
                mnemonic: newWallet.mnemonic.phrase,
                privateKey: newWallet.privateKey,
                address: newWallet.address
            }
            setWallet(wallet)
            setIsLoading(false)
        }, 100)
    }

    useEffect(() => {
        generateNewWallet()
    }, [])
    return (
        <View style={styles.container}>
            <View>
                <Text fontSize="2xl" bold>Pocket</Text>
            </View>

            <VStack space={5} alignItems="center">
                <Text fontSize="xl" bold>Your Secret Recovery Phrase</Text>
                <Text textAlign="center">This is your secret recovery phrase. You'll be asked to re-enter this on the next step. WRITE IT DOWN!</Text>

                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View style={{ width: "100%", height: 300 }}>
                        <View style={styles.mnemonicWrapper}>
                            {wallet && wallet.mnemonic.split(" ").map((word, index) => (
                                <HStack key={Math.random().toString()} alignItems="center" space={2} width="33%" marginTop={5}>
                                    <Text bold>{index + 1}</Text>
                                    <Text key={word} style={{ borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 5 }}>{word}</Text>
                                </HStack>
                            ))}
                        </View>

                        {!showMnemonic && (
                            <VStack space={4} style={styles.mnemonicMask} height={300}>
                                <MaterialIcons name="visibility-off" style={{ color: "white", fontSize: 30 }} />
                                <Text bold color="white">Tap to reveal your Secret Recovery Phrase</Text>
                                <Text color="grey">Mask sure no one is watching your screen</Text>
                                <Button variant="outline" onPress={() => setShowMnemonic(true)}>Reveal</Button>
                            </VStack>
                        )}
                    </View>
                )}
                <Button onPress={saveWallet} disabled={isLoading}>Continue</Button>
            </VStack>

        </View>
    )
}

export default GenerateMnemonic