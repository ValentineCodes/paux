import { Text, VStack, Input, Icon, Pressable, HStack } from 'native-base'
import React, { useState } from 'react'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"

type Props = {
  label: string;
  value?: string;
  infoText?: string | boolean | null;
  errorText?: string | boolean | null;
  onChange: (value: string) => void;
}

function PasswordInput({ label, value, infoText, errorText, onChange }: Props) {
  const [show, setShow] = useState(false)
  return (
    <VStack space={2}>
      <Text fontSize="xl" bold>{label}</Text>
      <Input
        value={value}
        borderRadius="lg"
        variant="filled"
        fontSize="md"
        InputLeftElement={
          <Icon as={<MaterialIcons name="lock" />} size={5} ml="4" color="muted.400" />
        }
        InputRightElement={
          <HStack space={1}>
            {value && <Pressable onPress={() => onChange("")}>
              <Icon as={<MaterialIcons name="close" />} size={5} mr="2" color="muted.400" />
            </Pressable>}
            <Pressable onPress={() => setShow(!show)} mr="2">
              <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>
          </HStack>
        }
        secureTextEntry={!show}
        placeholder="Password"
        onChangeText={onChange}
      />
      {infoText ? <Text fontSize="sm" color="muted.400">{infoText}</Text> : null}
      {errorText ? <Text fontSize="sm" color="red.400">{errorText}</Text> : null}
    </VStack>
  )
}

export default PasswordInput