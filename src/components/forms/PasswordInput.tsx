import { Icon, Input, Pressable, Text, View } from 'native-base'
import React, { useState } from 'react'
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"


type Props = {
    label: string;
    onChange: (value: string) => void;
}

function PasswordInput({label, onChange}: Props) {
    const [show, setShow] = useState(false)
  return (
    <View>
        <Text fontSize="md" bold>{label}</Text>
        <Input w={{
      base: "100%",
      md: "25%"
    }} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
      </Pressable>} onChangeText={value => onChange(value)} />
    </View>
  )
}

export default PasswordInput