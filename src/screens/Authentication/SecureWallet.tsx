import { Divider, ScrollView, Text, VStack, HStack } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { BottomSheet } from '@rneui/themed';

import ProgressIndicatorHeader from '../../components/headers/ProgressIndicatorHeader'
import { COLORS } from '../../utils/constants'
import BulletText from '../../components/BulletText'
import Button from '../../components/Button'

type Props = {}

export default function SecureWallet({ }: Props) {
    const [isSeedPhraseDescriptionVisible, setIsSeedPhraseDescriptionVisible] = useState(false)

    return (
        <ScrollView style={styles.container}>
            <ProgressIndicatorHeader progress={2} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" bold>Secure Your Wallet</Text>
            <Text textAlign="center" fontSize="lg" my="2">Secure your wallet's "<Text color={COLORS.primary} onPress={() => setIsSeedPhraseDescriptionVisible(true)}>Seed Phrase</Text>"</Text>

            <Divider bgColor="muted.100" my="4" />

            <VStack space={4} mb="50">
                <Text bold fontSize="xl">Manual</Text>
                <Text fontSize="lg">Write down your seed phrase on a piece of paper and store in a safe place.</Text>

                <Text fontSize="lg">Security level: Very strong</Text>

                <HStack alignItems="center" space={4}>
                    {Array(3).fill(null).map(_ => <Divider key={Math.random().toString()} w="12" h="1" bgColor={COLORS.primary} />)}
                </HStack>

                <VStack>
                    <Text fontSize="lg">Risks are:</Text>
                    <BulletText text="You lose it" />
                    <BulletText text="You forget where you put it" />
                    <BulletText text="Someone else finds it" />
                </VStack>

                <Text fontSize="lg">Other options: Doesn't have to be paper!</Text>

                <VStack>
                    <Text fontSize="lg">Tips:</Text>
                    <BulletText text="Store in bank vault" />
                    <BulletText text="Store in a safe" />
                    <BulletText text="Store in multiple secret places" />
                </VStack>

                <Divider bgColor="muted.100" mt="10" />

                <Button text="Start" onPress={() => console.log("Pressed!")} />
            </VStack>

            <BottomSheet isVisible={isSeedPhraseDescriptionVisible} onBackdropPress={() => setIsSeedPhraseDescriptionVisible(false)}>
                <VStack space={4} bgColor="white" borderTopLeftRadius={25} borderTopRightRadius={25} p="5">
                    <Text textAlign="center" fontSize="2xl" bold>What is a "Seed Phrase"?</Text>

                    <Divider bgColor="muted.100" my="2" />

                    <Text fontSize="md">A seed phrase is a set of twelve words that contains all the information about your wallet, including your funds. It's like a secret code used to access your entire wallet.</Text>
                    <Text fontSize="md">You must keep your seed phrase secret and safe. If someone gets your seed phrase, they'll gain control over your accounts.</Text>
                    <Text fontSize="md">Save it in a place where only you can access it. If you lose it, not even Pocket can help you recover it.</Text>

                    <Divider bgColor="muted.100" my="2" />

                    <Button text="OK, I Got It" onPress={() => setIsSeedPhraseDescriptionVisible(false)} />
                </VStack>
            </BottomSheet>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    }
})