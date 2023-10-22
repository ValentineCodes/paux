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
        clearRecipients: () => []
    }
})

export const {addRecipient, removeRecipient, clearRecipients} = recipientSlice.actions

export default recipientSlice.reducer