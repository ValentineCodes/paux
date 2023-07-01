import { HStack, Image, Text, VStack, Button } from 'native-base'
import React from 'react'
import { StyleSheet } from 'react-native'

type Props = {}

function MainBalance({}: Props) {
  return (
    <VStack alignItems="center" space={2} paddingY={5}>
        <Image source={require("../../../images/eth-icon.png")} alt="Ethereum" width={50} height={50} />
        <Text fontSize="xl" bold>0.05 ETH</Text>
        <HStack alignItems="center" space={2}>
            <Text>$85.27</Text>
            <Text style={[styles.percentDiff, {borderColor: "green", color: "green"}]}>12.2%</Text>
        </HStack>
        <Button.Group justifyContent="space-between">
          <Button>Deposit</Button>
          <Button>Transfer</Button>
        </Button.Group>
    </VStack>
  )
}

const styles = StyleSheet.create({
    percentDiff: {
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 5
    }
})

export default MainBalance