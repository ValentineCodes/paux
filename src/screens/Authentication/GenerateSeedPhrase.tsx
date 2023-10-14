import { Divider, Button as RNButton, ScrollView, Text, VStack, View, Icon } from 'native-base'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet } from 'react-native'
import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import { COLORS } from '../../utils/constants'
import { BlurView } from "@react-native-community/blur";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import SInfo from "react-native-sensitive-info";
import { initAccount } from '../../store/reducers/Accounts'

interface Wallet {
    mnemonic: string;
    privateKey: string;
    address: string;
}

type Props = {}

export default function GenerateSeedPhrase({ }: Props) {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [wallet, setWallet] = useState<Wallet>()
    const [showSeedPhrase, setShowSeedPhrase] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const saveWallet = async () => {
        if (!wallet) return
        try {
            await SInfo.setItem("mnemonic", wallet.mnemonic, {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            });
            const account = { privateKey: wallet.privateKey, address: wallet.address }
            await SInfo.setItem("accounts", JSON.stringify([account]), {
                sharedPreferencesName: "pocket.android.storage",
                keychainService: "pocket.ios.storage",
            })

            dispatch(initAccount({ address: account.address, isImported: false }))

            navigation.navigate("ConfirmSeedPhrase")
        } catch (error) {
            return
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
        }, 100);
    }

    useEffect(() => {
        generateNewWallet()
    }, [])

    return (
        <ScrollView style={styles.container}>
            <ProgressIndicatorHeader progress={2} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" lineHeight="40" bold>Write Down Your Seed Phrase</Text>
            <Text textAlign="center" fontSize="lg" my="2">This is your seed phrase. Write it down on a piece of paper and keep it in a safe place. You'll be asked to re-enter this phrase (in order) on the next step.</Text>

            <Divider bgColor="muted.100" my="4" />

            <View style={styles.seedPhraseContainer}>
                {isLoading ? <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> :
                    <View style={styles.seedPhraseWrapper}>
                        {wallet?.mnemonic.split(" ").map((word, index) => (
                            <Text key={word} style={styles.word}>{index + 1}. {word}</Text>
                        ))}
                    </View>}


                {
                    !showSeedPhrase && (
                        <>
                            <BlurView
                                style={styles.blurView}
                                blurType="light"
                                blurAmount={6}
                                reducedTransparencyFallbackColor="white"
                            />
                            <VStack style={styles.seedPhraseMask} space={2}>
                                <Text fontSize="xl" bold textAlign="center">Tap to reveal your seed phrase</Text>
                                <Text fontSize="sm" textAlign="center">Make sure no one is watching your screen</Text>
                                <RNButton py="3" borderRadius={25} bgColor="#2AB858" w="24" mt="2" leftIcon={<Icon as={<MaterialIcons name="visibility" color="white" />} size="md" />} onPress={() => setShowSeedPhrase(true)}><Text color="white" bold fontSize="lg">View</Text></RNButton>
                            </VStack>
                        </>
                    )
                }

            </View>

            <Divider bgColor="muted.100" my="4" />

            <Button text="Next" disabled={isLoading || !showSeedPhrase} onPress={saveWallet} style={{ marginBottom: 50 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    },
    loader: {
        height: 280,
        justifyContent: 'center',
        alignItems: "center",
    },
    seedPhraseContainer: {
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 40,
        padding: 15
    },
    seedPhraseWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    seedPhraseWord: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        width: "50%"
    },
    word: {
        width: '45%',
        padding: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 10
    },
    blurView: {
        position: "absolute",
        top: -20,
        left: -20,
        bottom: -20,
        right: -20
    },
    seedPhraseMask: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    }
})