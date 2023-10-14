import { Divider, Button as RNButton, ScrollView, Text, VStack, View, Icon } from 'native-base'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
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

type Props = {}

export default function ConfirmSeedPhrase({ }: Props) {
    return (
        <ScrollView style={styles.container}>
            <ProgressIndicatorHeader progress={3} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <Text textAlign="center" color={COLORS.primary} fontSize="4xl" lineHeight="40" bold>Confirm Seed Phrase</Text>
            <Text textAlign="center" fontSize="lg" my="2">Select each word in the order it was presented to you.</Text>

            <Divider bgColor="muted.100" my="4" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    },
})