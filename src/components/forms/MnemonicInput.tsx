import { Input, Icon, Button, HStack, Text } from 'native-base'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, View, StyleSheet, TextInput } from 'react-native'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"

type MnemonicInputProps = {}
type InputFieldProps = {
  onChange: (value: string) => void;
}
const InputField = ({onChange}: InputFieldProps) => {
  const [show, setShow] = useState(false)

  const handleValueChange = (value: string) => {
    onChange(value)
  }
  
  return (  
    <Input w={{
      base: "75%",
      md: "25%"
    }} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
      </Pressable>} onChangeText={handleValueChange} />
  )
}

function MnemonicInput({}: MnemonicInputProps) {
  const [mnemonic, setMnemonic] = useState(Array(12).fill(""))

  const renderMnemonicInput = useMemo(() => {
    return mnemonic.map((value, index) => {
      return (
        <HStack key={Math.random().toString()} alignItems="center" space={2} width="33%" marginTop={5}>
          <Text bold>{index + 1}</Text>
          <InputField onChange={value => {
            setMnemonic(mnemonic => {
              mnemonic[index] = value;
              return mnemonic
            })
          }} />
        </HStack>
      )
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.mnemonicInputContainer}>
        {renderMnemonicInput}
      </View>
      <Button onPress={() => console.log(mnemonic)}>Confirm</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  mnemonicInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20
  }
})

export default MnemonicInput