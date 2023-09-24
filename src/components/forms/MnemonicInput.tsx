import { useNavigation } from '@react-navigation/native'
import { Input, Icon, Button, HStack, Text } from 'native-base'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, View, StyleSheet, TextInput } from 'react-native'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"
import { useToast } from 'react-native-toast-notifications'

import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";

import SInfo from "react-native-sensitive-info";
import { useDispatch } from 'react-redux'
import { initAccount } from '../../store/reducers/Accounts'

type MnemonicInputProps = {}
type InputFieldProps = {
  onChange: (value: string) => void;
}
const InputField = ({ onChange }: InputFieldProps) => {
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

function MnemonicInput({ }: MnemonicInputProps) {
  const navigation = useNavigation()
  const toast = useToast();

  const dispatch = useDispatch()

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

  const confirm = async () => {
    if (mnemonic.length !== 12) {
      toast.show("Incomplete mnemonic", {
        type: "warning"
      })
      return
    }

    const _mnemonic = mnemonic.join(" ")
    if (ethers.utils.isValidMnemonic(_mnemonic)) {
      const wallet = ethers.Wallet.fromMnemonic(_mnemonic)
      const _wallet = {
        privateKey: wallet.privateKey,
        address: wallet.address
      }

      // Save wallet
      await SInfo.setItem("mnemonic", _mnemonic, {
        sharedPreferencesName: "pocket.android.storage",
        keychainService: "pocket.ios.storage",
      });
      await SInfo.setItem("accounts", JSON.stringify([_wallet]), {
        sharedPreferencesName: "pocket.android.storage",
        keychainService: "pocket.ios.storage",
      })

      dispatch(initAccount({ address: _wallet.address, fromMnemonic: true }))

      navigation.navigate("CreatePassword")
    } else {
      toast.show("Invalid Mnemonic!", {
        type: "danger"
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mnemonicInputContainer}>
        {renderMnemonicInput}
      </View>
      <Button onPress={confirm}>Confirm</Button>
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