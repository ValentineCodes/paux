import { Text, Select, CheckIcon, Box, HStack, Modal, VStack, Button, ScrollView } from 'native-base'
import React, { useState, useRef } from 'react'

const NETWORKS = [
    {
        name: "Ethereum",
        value: "mainnet"
    }, {
        name: "Sepolia",
        value: "sepolia"
    }, {
        name: "Goerli",
        value: "goerli"
    }, {
        name: "Arbitrum",
        value: "arbitrum"
    }, {
        name: "ArbitrumGoerli",
        value: "arbitrumGoerli"
    }, {
        name: "Optimism",
        value: "optimism"
    }, {
        name: "OptimismGoerli",
        value: "optimismGoerli"
    }, {
        name: "Polygon",
        value: "polygon"
    }, {
        name: "Mumbai",
        value: "mumbai"
    }
]

const ACCOUNTS = [
    {
        name: "Account 1",
        address: "0xF51CD0d607c82db2B70B678554c52C266a9D49B6",
        privateKey: "0xF51CD0d607c82db2B70B678554c52C266a9D49B6F51CD0d607c82db2B70B678554c52C266a9D49B6"
    }, {
        name: "Account 2",
        address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D901",
        privateKey: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D9017a82bbfD10E3Ce5817dEcC0ee870e17D6853D901"
    }, {
        name: "Account 3",
        address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D902",
        privateKey: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D9017a82bbfD10E3Ce5817dEcC0ee870e17D6853D901"
    }, {
        name: "Account 4",
        address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D903",
        privateKey: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D9017a82bbfD10E3Ce5817dEcC0ee870e17D6853D901"
    }, {
        name: "Account 5",
        address: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D904",
        privateKey: "0x7a82bbfD10E3Ce5817dEcC0ee870e17D6853D9017a82bbfD10E3Ce5817dEcC0ee870e17D6853D901"
    }
]

type Props = {}

function Header({}: Props) {
    const [selectedNetwork, setSelectedNetwork] = useState("mainnet")
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)

    const accountInitialRef = useRef(null)
    const accountFinalRef = useRef(null)

  return (
    <HStack alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="#ccc" padding={2}>
        <Text fontSize="2xl" bold>Pocket</Text>

        <HStack space={2}>
            <Box maxW="200">
                <Select selectedValue={selectedNetwork} minWidth="200" accessibilityLabel="Choose Network" placeholder="Choose Network" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
            }} mt={1} onValueChange={network => setSelectedNetwork(network)}>
                    {NETWORKS.map(network => <Select.Item key={network.value} label={network.name} value={network.value} />)}
                </Select>
            </Box>

            <Button onPress={() => setIsAccountModalVisible(true)}>Accounts</Button>
        </HStack>
            {/* Accounts */}
            <Modal isOpen={isAccountModalVisible} onClose={() => setIsAccountModalVisible(false)} initialFocusRef={accountInitialRef} finalFocusRef={accountFinalRef}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>My Accounts</Modal.Header>
                    <Modal.Body maxHeight={200}>
                        <ScrollView>
                            {ACCOUNTS.map((account, index) => (
                                <VStack key={account.address} paddingY={3} borderBottomWidth={index === ACCOUNTS.length - 1? 0 : 1} borderBottomColor="#ccc">
                                    <Text>{account.name}</Text>
                                    <Text>0.05 ETH</Text>
                                </VStack>
                            ))}
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button>
                                Create
                            </Button>
                            <Button variant="outline">
                                Import
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
    </HStack>
  )
}

export default Header