import { HStack, Icon, View } from 'native-base'
import React from 'react'
import { Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/dist/Ionicons'
import ProgressStepIndicator from '../ProgressStepIndicator'
import { useNavigation } from '@react-navigation/native'

type Props = {
    progress: number;
}

const ProgressIndicatorHeader = ({ progress }: Props) => {
    const navigation = useNavigation()

    return (
        <HStack alignItems="center">
            <Icon as={<Ionicons name="arrow-back-outline" />} size={7} color="black" onPress={() => navigation.goBack()} />
            <View position="absolute" top={3.5} left={Dimensions.get("window").width * 0.19}>
                <ProgressStepIndicator steps={3} progress={progress} width={Dimensions.get("window").width * 0.5} size={Dimensions.get("window").width * 0.04} />
            </View>
        </HStack>
    )
}

export default ProgressIndicatorHeader