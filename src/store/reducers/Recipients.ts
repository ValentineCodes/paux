import {createSlice} from '@reduxjs/toolkit';

export const recipientSlice = createSlice({
    name: "RECIPIENT",
    initialState: [] as string[],
    reducers: {
        addRecipient: (state, action) => {
            const newRecipient = action.payload.toUpperCase()
            if(!state.map(recipient => recipient.toUpperCase()).includes(newRecipient)) {
                return [...state, newRecipient]
            } else {
                return state
            }
        },
        removeRecipient: (state, action) => {
            const removedRecipient = action.payload.toUpperCase()
            return state.filter(recipient => recipient.toUpperCase() !== removedRecipient)
        },
        clearRecipients: (state, action) => {
            return []
        }
    }
})

export const {addRecipient, removeRecipient} = recipientSlice.actions

export default recipientSlice.reducer