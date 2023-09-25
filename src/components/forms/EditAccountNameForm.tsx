import React, { useState } from 'react'
import { HStack, VStack, Input, Icon } from "native-base"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { useSelector, useDispatch } from 'react-redux'
import { Account, changeName } from '../../store/reducers/Accounts'
import { useToast } from 'react-native-toast-notifications'

type Props = {
    close: () => void
}

export default function EditAccountNameForm({ close }: Props) {
    const dispatch = useDispatch()
    const toast = useToast()

    const accounts: Account[] = useSelector(state => state.accounts)
    const connectedAccount: Account = useSelector(state => state.accounts.find((account: Account) => account.isConnected))

    const [name, setName] = useState(connectedAccount.name)

    const editName = () => {
        if (name.trim().length === 0) {
            toast.show("Account name cannot be empty", {
                type: "error"
            })
            return
        }
        if (accounts.find(account => account.name == name) !== undefined) {
            toast.show("Account name already exists", {
                type: "error"
            })
            return
        }
        dispatch(changeName({ address: connectedAccount.address, newName: name }))
        close()
    }
    return (
        <HStack alignItems="center" space={2}>
            <VStack w="75%">
                <Input w={{
                    base: "75%",
                    md: "25%"
                }} placeholder='new name' value={name} onChangeText={value => setName(value)} />
            </VStack>

            <Icon as={<Ionicons name="checkmark-done-outline" />} size={5} color="muted.400" ml={3} onPress={editName} />
        </HStack>
    )
}