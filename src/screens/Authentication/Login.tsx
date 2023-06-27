import { Button, Center, Text } from 'native-base'
import React, { useState } from 'react'
import PasswordInput from '../../components/forms/PasswordInput'
import { useToast } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'


type Props = {}

function Login({}: Props) {
    const toast = useToast()
    const navigation = useNavigation()

    const [password, setPassword] = useState("")

    const unlock = async () => {
        if(!password) {
            toast.show("Password cannot be empty!", {
                type: "danger"
            })
            return
        }

        const _security = await AsyncStorage.getItem("security")
        const security = JSON.parse(_security!)

        if(password !== security.password) {
            toast.show("Incorrect password!", {
                type: "danger"
            })
            return
        }

        navigation.navigate("Home")
    }
  return (
    <Center>
        <Text fontSize="2xl" bold>Welcome Back</Text>
        <PasswordInput label="Password" onChange={setPassword} />
        <Button marginTop={5} onPress={unlock}>Unlock</Button>
    </Center>
  )
}

export default Login